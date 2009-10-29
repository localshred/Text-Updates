Text Updates was written as a front-end to show incoming SMS texts through jQuery AJAX.

Author: BJ Neilsen of [rand9 Technologies][rand9]  
Authored for: Ryan Byrd of [RyanByrd.net][rbdn] (Happy wedding!)

### Installation

You'll need to install this table.

<code><pre>
CREATE TABLE `googletext` (
  `id` int(11) NOT NULL auto_increment,
  `sender` varchar(50) default NULL,
  `message` varchar(50) default NULL,
  `post_time` varchar(50) default NULL,
  `approved` int(1) default '0',
  `ts` timestamp NOT NULL default CURRENT_TIMESTAMP,
  `last_displayed` datetime default NULL,
  PRIMARY KEY  (`id`)
)
</pre></code>

### Usage

Simply go to `index.html` to begin the loop.

  [rand9]: http://www.rand9.com "rand9 Technologies"
  [rbdn]: http://www.ryanbyrd.net/rambleon "RyanByrd.net"