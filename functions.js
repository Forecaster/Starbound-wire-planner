function showOptionsMenu(forTile)
{
  target_tile = document.getElementById(forTile);

  if (components[target_tile.id] == null || components[target_tile.id] == undefined || !components[target_tile.id].connectionsVisible)
  {
    var menuElement = document.getElementById("menu_options");
    var toggleButtonElement = document.getElementById("menu_options_toggle_button");
    var pointsButtonElement = document.getElementById("menu_options_show_points_button");
    var position = getPosition(target_tile);

    if (components[target_tile.id] == null || components[target_tile.id] == undefined || !components[target_tile.id].allowManualToggle)
    {
      toggleButtonElement.className = "toggleButtonDisabled";
      toggleButtonElement.onclick = null;
    }
    else
    {
      toggleButtonElement.className = "toggleButtonEnabled menu_item";
      toggleButtonElement.onclick = function ()
      {
        hideOptionsMenu();
        components[target_tile.id].toggle();
      };
    }

    if (components[target_tile.id] == null || components[target_tile.id] == undefined)
    {
      pointsButtonElement.className = "toggleButtonDisabled";
      pointsButtonElement.onclick = null;
    }
    else
    {
      pointsButtonElement.className = "toggleButtonEnabled menu_item";
      pointsButtonElement.onclick = function ()
      {
        hideOptionsMenu();
        togglePoints(target_tile.id);
      };
    }

    menuElement.style.top = (position.y + 15) + "px";
    menuElement.style.left = (position.x + 15) + "px";
  }
}

function hideOptionsMenu()
{
  var menuElement = document.getElementById("menu_options");

  menuElement.style.top = "-500px";
  menuElement.style.left = "-500px";
}

function showComponentsMenu()
{
  var menuElement = document.getElementById("menu_components");
  var menuTitleElement = document.getElementById("menu_components_title");
  var position = getPosition(target_tile);

  menuTitleElement.innerHTML = "Set component for tile #" + target_tile.id.replace("tile_", "");
  menuElement.style.top = (position.y + 15) + "px";
  menuElement.style.left = (position.x + 15) + "px";
}

function hideComponentsMenu()
{
  var menuElement = document.getElementById("menu_components");

  menuElement.style.top = "-500px";
  menuElement.style.left = "-500px";
}

function setTileToComponent(type)
{
  if (type == "smallWallSwitch")
    components[target_tile.id] = new SmallWallSwitch(target_tile.id);
  else if (type == "bulb")
    components[target_tile.id] = new Bulb(target_tile.id);
  else if (type == "persistentSwitch")
    components[target_tile.id] = new PersistentSwitch(target_tile.id);

  target_tile.style.backgroundImage = "url(" + components[target_tile.id].texture + ")";

  if (components[target_tile.id].currentState == "ON")
    target_tile.style.backgroundPosition = components[target_tile.id].stateOn;
  else
    target_tile.style.backgroundPosition = components[target_tile.id].stateOff;

  if (components[target_tile.id].connection_1 === false)
    document.getElementById(target_tile.id + "_inbound_1").style.visibility = "hidden";
  if (components[target_tile.id].connection_2 === false)
    document.getElementById(target_tile.id + "_inbound_2").style.visibility = "hidden";
  if (components[target_tile.id].connection_3 === false)
    document.getElementById(target_tile.id + "_outbound_1").style.visibility = "hidden";
  if (components[target_tile.id].connection_4 === false)
    document.getElementById(target_tile.id + "_outbound_2").style.visibility = "hidden";
}

function togglePoints(id)
{
  var element = document.getElementById(id + "_points");

  if (element.style.visibility == "hidden")
    element.style.visibility = "visible";
  else
    element.style.visibility = "hidden";
}

function showConnectMenu(tile_id, point_id)
{
  target_tile = document.getElementById(tile_id);

  components[target_tile.id].connectionsVisible = true;
  var menuElement = document.getElementById("menu_connect");
  var menuTitleElement = document.getElementById("menu_connect_title");
  var menuChoicesElement = document.getElementById("menu_connect_choices");
  var position = getPosition(target_tile);

  var inputOutput = "";

  if (point_id == 1)
  {
    menuTitleElement.innerHTML = "Connect input 1 to...";
    inputOutput = "input";
  }
  else if (point_id == 2)
  {
    menuTitleElement.innerHTML = "Connect input 2 to...";
    inputOutput = "input";
  }
  else if (point_id == 3)
  {
    menuTitleElement.innerHTML = "Connect output 1 to...";
    inputOutput = "output";
  }
  else if (point_id == 4)
  {
    menuTitleElement.innerHTML = "Connect output 2 to...";
    inputOutput = "output";
  }

  var str = "";
  for (var key in components)
  {
    if (key != undefined)
    {
      if (key != tile_id)
      {
        if (inputOutput == "output") //search for valid inputs
        {
          if (components[key].connection_1 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[target_tile.id], components[\"" + key + "\"], " + point_id + ", 1);'>" + components[key].componentName + " - " + components[key].componentId + " - Input 1</div>";
          }

          if (components[key].connection_2 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[target_tile.id], components[\"" + key + "\"], " + point_id + ", 2);'>" + components[key].componentName + " - " + components[key].componentId + " - Input 2</div>";
          }
        }
        else if (inputOutput == "input") //search for valid outputs
        {
          if (components[key].connection_3 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[\"" + key + "\"], components[target_tile.id], 3, " + point_id + ");'>" + components[key].componentName + " - " + components[key].componentId + " - Output 1</div>";
          }

          if (components[key].connection_4 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[\"" + key + "\"], components[target_tile.id], 4, " + point_id + ");'>" + components[key].componentName + " - " + components[key].componentId + " - Output 2</div>";
          }
        }
      }
    }
    else
      console.log("Tried to iterate over undefined key " + key);
  }

  menuChoicesElement.innerHTML = str;
  menuElement.style.top = position.y;
  menuElement.style.left = position.x;
}

function hideConnectMenu()
{
  components[target_tile.id].connectionsVisible = false;

  var menuElement = document.getElementById("menu_connect");

  menuElement.style.top = "-500px";
  menuElement.style.left = "-500px";
}

function connectComponents(componentSource, componentTarget, connectionSource, connectionTarget)
{
  var duplicateConnection = false;
  if (connectionTarget == 1)
  {
    for (var key in componentTarget.connection_1)
    {
      if (componentTarget.connection_1[key].componentId == target_tile.id)
        duplicateConnection = true;
    }

    if (!duplicateConnection)
    {
      console.log("1: This is not a duplicate connection!");
      componentTarget.connection_1.push(componentSource);
      if (connectionSource == 1)
        componentSource.connection_1.push(componentTarget);
      else if (connectionSource == 2)
        componentSource.connection_2.push(componentTarget);
      else if (connectionSource == 3)
        componentSource.connection_3.push(componentTarget);
      else if (connectionSource == 4)
        componentSource.connection_4.push(componentTarget);
    }
    else
      console.log("1: Duplicate connection!");
  }
  else if (connectionTarget == 2)
  {
    for (var key in componentTarget.connection_2)
    {
      if (componentTarget.connection_2[key].componentId == target_tile.id)
        duplicateConnection = true;
    }

    if (!duplicateConnection)
    {
      console.log("2: This is not a duplicate connection!");
      componentTarget.connection_2.push(componentSource);
      if (connectionSource == 1)
        componentSource.connection_1.push(componentTarget);
      else if (connectionSource == 2)
        componentSource.connection_2.push(componentTarget);
      else if (connectionSource == 3)
        componentSource.connection_3.push(componentTarget);
      else if (connectionSource == 4)
        componentSource.connection_4.push(componentTarget);
    }
    else
      console.log("2: Duplicate connection!");
  }
  else if (connectionTarget == 3)
  {
    for (var key in componentTarget.connection_3)
    {
      if (componentTarget.connection_3[key].componentId == target_tile.id)
        duplicateConnection = true;
    }

    if (!duplicateConnection)
    {
      console.log("3: This is not a duplicate connection!");
      componentTarget.connection_3.push(componentSource);
      if (connectionSource == 1)
        componentSource.connection_1.push(componentTarget);
      else if (connectionSource == 2)
        componentSource.connection_2.push(componentTarget);
      else if (connectionSource == 3)
        componentSource.connection_3.push(componentTarget);
      else if (connectionSource == 4)
        componentSource.connection_4.push(componentTarget);
    }
    else
      console.log("3: Duplicate connection!");
  }
  else if (connectionTarget == 4)
  {
    for (var key in componentTarget.connection_4)
    {
      if (componentTarget.connection_4[key].componentId == target_tile.id)
        duplicateConnection = true;
    }

    if (!duplicateConnection)
    {
      console.log("4: This is not a duplicate connection!");
      componentTarget.connection_4.push(componentSource);
      if (connectionSource == 1)
        componentSource.connection_1.push(componentTarget);
      else if (connectionSource == 2)
        componentSource.connection_2.push(componentTarget);
      else if (connectionSource == 3)
        componentSource.connection_3.push(componentTarget);
      else if (connectionSource == 4)
        componentSource.connection_4.push(componentTarget);
    }
    else
      console.log("4: Duplicate connection!");
  }
  else
    console.log("Wut " + connectionTarget);
}

function showConnectionListMenu()
{
  var menuElement = document.getElementById("menu_connection_list");
  var menuContentElement = document.getElementById("menu_connection_list_contents");
  var position = getPosition(target_tile);

  var str = "";
  if (components[target_tile.id].connection_1 !== false)
  {
    for (key in components[target_tile.id].connection_1)
    {
      str = str + "<div>" + components[target_tile.id].connection_1[key].componentName + " - " + components[target_tile.id].connection_1.componentId + "</div>";
    }
  }

  if (str == "")
    str = "<div>No connections.</div>";

  menuContentElement.innerHTML = str;
  menuElement.style.top = (position.y + 15) + "px";
  menuElement.style.left = (position.x + 15) + "px";
}

function hideConnectionListMenu()
{
  var menuElement = document.getElementById("menu_connection_list");

  menuElement.style.top = "-500px";
  menuElement.style.left = "-500px";
}