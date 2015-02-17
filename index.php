<?php
ini_set('display_errors', 'on');

$generate_rows = 10;
$generate_cols = 10;

$row_id = 0;
$tile_id = 0;
?>

<HTML>
<head>
  <title>Starbound Wire Planner Prototype</title>

  <link rel="stylesheet" type="text/css" href="styles.css"/>
  <script language="javascript" src="functions.js"></script>
  <script language="JavaScript" src="mouse_track.js"></script>
  <script language="JavaScript" src="mouse_events.js"></script>

  <script language="JavaScript" src="class.SmallWallSwitch.js"></script>
  <script language="JavaScript" src="class.Bulb.js"></script>
  <script language="JavaScript" src="class.PersistentSwitch.js"></script>
</head>
<body>

<div id="menu_options" class="componentsMenu">
  <div class="menu_item" onClick="hideOptionsMenu(); showComponentsMenu();">- Set component</div>
  <div id="menu_options_toggle_button" class="toggleButtonDisabled" onClick="">- Toggle</div>
  <!--<div id="menu_options_show_points_button" class=" menu_item" onClick"">- Toggle Connections</div>-->
  <div class="menu_item" onClick="components[target_tile.id].inputUpdate();">Force Update (Debug)</div>
  <div class="menu_item" onClick="hideOptionsMenu();">Cancel</div>
</div>

<div id="menu_components" class="componentsMenu">
  <div id="menu_components_title"></div>
  <div class="menu_item" onClick="hideComponentsMenu(); setTileToComponent('smallWallSwitch');">- Small Wall Switch</div>
  <div class="menu_item" onClick="hideComponentsMenu(); setTileToComponent('bulb');">- Bulb</div>
  <div class="menu_item" onClick="hideComponentsMenu(); setTileToComponent('persistentSwitch');">- Persistent Switch</div>
  <div class="menu_item" onClick="hideComponentsMenu(); setTileToComponent('');"></div>
  <div class="menu_item" onClick="hideComponentsMenu();">Cancel</div>
</div>

<div id="menu_connect" class="componentsMenu">
  <div id="menu_connect_title">Things go here</div>
  <div id="menu_connect_choices"></div>
  <div class="menu_item" onClick="hideConnectMenu(); showConnectionListMenu();">Current Connections</div>
  <div class="menu_item" onClick="hideConnectMenu();">Cancel</div>
</div>

<div id="menu_connection_list" class="componentsMenu">
  <div id="menu_connection_list_contents"></div>
  <div class="menu_item" onClick="">Disconnect All</div>
  <div class="menu_item" onClick="hideConnectionListMenu();">Close</div>
</div>

<div id="lineContainer" class="lineContainer"></div>

<div id="newConnectionContainer" class="lineContainer">
  <svg class='lineContainer'>
    <line id="newConnectionLine" class="connectionLine" x1="0" y1="0" x2="0" y2="0"></line>
  </svg>
</div>

<div id="main_menu" class="main_menu">
  <div class="menu_item" onClick="toggleAllPoints();">Toggle Connection Mode</div>
</div>

<div>
  <div id="components_bar" class="componentsBar">
    <div id="" class="component"></div>
  </div>
  <div id="grid" class="grid">
  <?php
    $row_id = 0;
    for ($row_counter = 0; $row_counter < $generate_rows; $row_counter++)
    {
      echo "<div id=\"" . $row_id . "\" class=\"row\">";
      for ($col_counter = 0; $col_counter < $generate_cols; $col_counter++)
      {
        $tile_pos = $row_id . "-" . $col_counter;
        echo "<div id=\"tile_" . $tile_pos . "\" class=\"pnt tile\" onClick=\"activateTile('tile_" . $tile_pos . "');\" title=\"" .$tile_pos . "\">
          <div id=\"tile_" . $tile_pos . "_points\" style=\"visibility: hidden;\">
            <div id=\"tile_" . $tile_pos . "_inbound_1\" class=\"point_inbound point_tl\" onClick=\"//showConnectMenu(this.parentElement.parentElement.id, 1);\"></div>
            <div id=\"tile_" . $tile_pos . "_inbound_2\" class=\"point_inbound point_bl\" onClick=\"//showConnectMenu(this.parentElement.parentElement.id, 2);\"></div>
            <div id=\"tile_" . $tile_pos . "_outbound_3\" class=\"point_outbound point_br\" onClick=\"//showConnectMenu(this.parentElement.parentElement.id, 3);\"></div>
            <div id=\"tile_" . $tile_pos . "_outbound_4\" class=\"point_outbound point_tr\" onClick=\"//showConnectMenu(this.parentElement.parentElement.id, 4);\"></div>
          </div>
        </div>";
      }
      echo "</div>";
      $row_id++;
    }
  ?>
  </div>
  <div id="description" class="description">
    <?
      echo nl2br("Yes! Hi!
      So this is a thing I made!

      This is the current in-development version of my Starbound Wire Planner, or SWP for short, that I made because I couldn't find one.

      <a style='color: red;'>FIRST, A DISCLAIMER!</a> I'm not associated with Chucklefish in any way! The assets for the components are from the game, used with no permissions what-so-ever, but with no harm intended!
      There are no ads on any of my sites.
      Also, this is a prototype/experiment and it's not in a usable state right now. There are bugs and missing features.

      Now, someone asked \"What's the point\" (paraphrased), and I can sort of see it since wiring in Starbound is relatively accessible.
      But there are still some advantages to be had with an external tool, like say, having unlimited components, and unlimited reach cuts down on the time required.

      It's also a fun challenge for me.

      Now then, this program thingy works like this currently:

      You have before you a grid of tiles (as they are referred to internally), and each tile can be assigned a component.
      There are currently three components added: the Small Wall Switch, Bulb and the Persistent Switch.
      The Wall Switch and the Bulb are fully operational, but the Persistent Switch has no logic in it yet and thus doesn't do anything.

      To assign a component you left-click a tile and select \"Set Component\", then select the component from the list.
      Once a component has been assigned, if you left-click the tile again the \"Toggle Connections\" option will be available, and \"Toggle\" will be available if the component allows manual toggling. (The Wall Switch does, but the Bulb and Persistent Switch doesn't)

      \"Toggle\" simply turns the component on/off like you would by activating it in-game.
      \"Toggle Connections\" will show the connection nodes for the component. You may then click a node which will display a dialogue showing a list of other components that have opposite nodes.
      There is also \"Current Connections\" which will show a list of all components that are already connected to this node.
      At the moment you cannot remove connections. This will obviously come soon.
      ");
    ?>
  </div>
</div>

<script language="JavaScript">
  var target_tile = null; //This contains the element for the current tile that is being used as the origin for menus, it's set when a menu is opened
  var tile_has_component = false;
  var components = [];
  var playMode = false;
  var connectionMode = false;
  var drawNewConnection = false;

  var componentMenu = [];

  componentMenu.push(new SmallWallSwitch(null));
  componentMenu.push(new Bulb(null));
  componentMenu.push(new PersistentSwitch(null));

  var componentsMenuContents = "";
  for (var key_1 in componentMenu)
  {
    var texture = componentMenu[key_1].texture;
    var name = componentMenu[key_1].componentClassName;
    componentsMenuContents += "<div id=\"component_" + name + "\" class=\"component\" style=\"background-image: url('" + texture + "'); top: 0; left: 0;\"></div>";
  }
  document.getElementById("components_bar").innerHTML = componentsMenuContents;
</script>

</body>
</HTML>