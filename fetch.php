<?php
date_default_timezone_set("America/Denver");

// $connection = mysql_connect('localhost', 'googletext', '783409haf7983') or die(mysql_error());
$connection = mysql_connect('localhost', 'root', '') or die(mysql_error());
mysql_select_db('googletext', $connection) or die(mysql_error());

$messages = array();
$response = array("messages" => &$messages);

function doQuery($sql, &$messages, $connection)
{
  $result = mysql_query($sql, $connection);
  if ($result != null && mysql_num_rows($result) > 0)
  {
    while ($row = mysql_fetch_object($result))
    {
      $sender = preg_replace("/.*(\d{4})\s*/", "$1", $row->sender);
      $messages[] = array(
        "id" => $row->id,
        "message" => $row->message,
        "sender" => $sender,
        "ts" => date("g:i:s a", $row->ts)
      );
    }
  }
}

// Get all new messages
$sql = "SELECT id, message, sender, ts as num_messages FROM googletext WHERE approved = true AND last_displayed IS NULL";
doQuery($sql, $messages, $connection);
if (count($messages) <= 0)
{
  // No new messages, so get 5 random already displayed messages
  $sql = "SELECT id, message, sender, ts FROM googletext WHERE approved = true ORDER BY rand() LIMIT 5";
  doQuery($sql, $messages, $connection);
  
  // if (count($messages) <= 0)
  // {
  //   $messages[] = "Lorem ipsum dolor sit amet";
  //   $messages[] = "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  //   $messages[] = "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
  //   $messages[] = "Duis aute irure dolor";
  //   $messages[] = "in reprehenderit in voluptate velit esse cillum dolore";
  //   $messages[] = "eu fugiat nulla pariatur.";
  //   $messages[] = "Excepteur sint occaecat cupidatat non proident";
  //   $messages[] = "sunt in culpa qui";
  //   $messages[] = "officia deserunt mollit";
  //   $messages[] = "anim id est laborum.";
  // }
}

if (count($messages) > 0)
{
  $sql = "SELECT count(*) as num_messages from googletext where approved = true";
  $result = mysql_query($sql, $connection);
  if ($result != null && mysql_num_rows($result) > 0)
  {
    $row = mysql_fetch_object($result);
    $response["num_messages"] = $row->num_messages;
  }
  
  $sql = "UPDATE googletext SET last_displayed = NOW() WHERE id IN (".implode(",", array_keys($messages)).")";
  $result = mysql_query($sql, $connection);
  if (!$result)
    echo "FAILED to update the code: ".mysql_error($connection);
}

mysql_close($connection);

print json_encode($response);

?>