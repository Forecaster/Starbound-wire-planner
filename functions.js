function add(x, y)
{
  return (x + y);
}

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

    //if (components[target_tile.id] == null || components[target_tile.id] == undefined)
    //{
    //  pointsButtonElement.className = "toggleButtonDisabled";
    //  pointsButtonElement.onclick = null;
    //}
    //else
    //{
    //  pointsButtonElement.className = "toggleButtonEnabled menu_item";
    //  pointsButtonElement.onclick = function ()
    //  {
    //    hideOptionsMenu();
    //    togglePoints(target_tile.id);
    //  };
    //}

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

  if (connectionMode)
    togglePoints(target_tile.id);
}

function toggleAllPoints()
{
  for (var key_1 in components)
  {
    var id = components[key_1].componentId;
    togglePoints(id);
  }

  if (connectionMode == true)
    connectionMode = false;
  else
    connectionMode = true;
}

function togglePoints(id)
{
  var element = document.getElementById(id + "_points");

  if (element.style.visibility == "hidden")
  {
    element.style.visibility = "visible";
    drawConnections();
  }
  else
  {
    element.style.visibility = "hidden";
    clearConnections();
  }
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
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[target_tile.id], components[\"" + key + "\"], " + point_id + ", 1);'>- " + components[key].componentName + " - " + components[key].componentId + " - Input 1</div>";
          }

          if (components[key].connection_2 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[target_tile.id], components[\"" + key + "\"], " + point_id + ", 2);'>- " + components[key].componentName + " - " + components[key].componentId + " - Input 2</div>";
          }
        }
        else if (inputOutput == "input") //search for valid outputs
        {
          if (components[key].connection_3 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[\"" + key + "\"], components[target_tile.id], 3, " + point_id + ");'>- " + components[key].componentName + " - " + components[key].componentId + " - Output 1</div>";
          }

          if (components[key].connection_4 !== false)
          {
            str = str + "<div class='menu_item' onClick='hideConnectMenu(); connectComponents(components[\"" + key + "\"], components[target_tile.id], 4, " + point_id + ");'>- " + components[key].componentName + " - " + components[key].componentId + " - Output 2</div>";
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
  }
  drawConnections();
}

function disconnectComponents(componentFrom, componentTo)
{
  var sourceId = componentFrom.componentId;
  var targetId = componentTo.componentId;

  for (var key in componentFrom.connection_3)
  {
    if (componentFrom.connection_3[key].componentId == targetId)
    {
      componentFrom.connection_3[key].inputUpdate(components[target_tile.id].componentId);
      delete componentFrom.connection_3[key];
    }
  }

  for (var key in componentFrom.connection_4)
  {
    if (componentFrom.connection_4[key].componentId == targetId)
    {
      componentFrom.connection_4[key].inputUpdate(components[target_tile.id].componentId);
      delete componentFrom.connection_4[key];
    }
  }

  for (var key in componentTo.connection_1)
  {
    if (componentTo.connection_1[key].componentId == sourceId)
    {
      componentTo.connection_1[key].inputUpdate(components[target_tile.id].componentId);
      delete componentTo.connection_1[key];
    }
  }

  for (var key in componentTo.connection_2)
  {
    if (componentTo.connection_2[key].componentId == sourceId)
    {
      componentTo.connection_2[key].inputUpdate(components[target_tile.id].componentId);
      delete componentTo.connection_2[key];
    }
  }
  drawConnections();
}

function showConnectionListMenu()
{
  var menuElement = document.getElementById("menu_connection_list");
  var menuContentElement = document.getElementById("menu_connection_list_contents");
  var position = getPosition(target_tile);

  var str = "";
  if (components[target_tile.id].connection_1 !== false)
  {
    for (var key in components[target_tile.id].connection_1)
    {
      str = str + "<div class=\"menu_item\" onClick=\"hideConnectionListMenu(); disconnectComponents(components[target_tile.id], components[target_tile.id].connection_1[" + key + "]);\">" + components[target_tile.id].connection_1[key].componentName + " - " + components[target_tile.id].connection_1[key].componentId + "</div>";
    }
  }

  if (components[target_tile.id].connection_2 !== false)
  {
    for (var key in components[target_tile.id].connection_2)
    {
      str = str + "<div class=\"menu_item\" onClick=\"hideConnectionListMenu(); disconnectComponents(components[target_tile.id], components[target_tile.id].connection_2[" + key + "]);\">" + components[target_tile.id].connection_2[key].componentName + " - " + components[target_tile.id].connection_2[key].componentId + "</div>";
    }
  }

  if (components[target_tile.id].connection_3 !== false)
  {
    for (var key in components[target_tile.id].connection_3)
    {
      str = str + "<div class=\"menu_item\" onClick=\"hideConnectionListMenu(); disconnectComponents(components[target_tile.id], components[target_tile.id].connection_3[" + key + "]);\">" + components[target_tile.id].connection_3[key].componentName + " - " + components[target_tile.id].connection_3[key].componentId + "</div>";
    }
  }

  if (components[target_tile.id].connection_4 !== false)
  {
    for (var key in components[target_tile.id].connection_4)
    {
      str = str + "<div class=\"menu_item\" onClick=\"hideConnectionListMenu(); disconnectComponents(components[target_tile.id], components[target_tile.id].connection_4[" + key + "]);\">" + components[target_tile.id].connection_4[key].componentName + " - " + components[target_tile.id].connection_4[key].componentId + "</div>";
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

function drawConnections()
{
  var lines = "";
  for (var key_1 in components)
  {
    var targets_in_1 = [];
    var targets_in_2 = [];
    var targets_out_1 = [];
    var targets_out_2 = [];
    if (components[key_1].connection_1 !== false)
    {
      for (var key_2 in components[key_1].connection_1)
      {
        for (var key_3 in components[key_1].connection_1[key_2].connection_3)
        {
          if (components[key_1].connection_1[key_2].connection_3[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_1[key_2].componentId + "_outbound_1";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_in_1.push(getPosition(element));
          }
        }

        for (var key_3 in components[key_1].connection_1[key_2].connection_4)
        {
          if (components[key_1].connection_1[key_2].connection_4[key_3].componentId == components[key_1])
          {
            var id = components[key_1].connection_1[key_2].componentId + "_outbound_2";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_in_1.push(getPosition(element));
          }
        }
      }
    }
    if (components[key_1].connection_2 !== false)
    {
      for (var key_2 in components[key_1].connection_2)
      {
        for (var key_3 in components[key_1].connection_2[key_2].connection_3)
        {
          if (components[key_1].connection_2[key_2].connection_3[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_2[key_2].componentId + "_outbound_1";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_in_2.push(getPosition(element));
          }
        }

        for (var key_3 in components[key_1].connection_2[key_2].connection_4)
        {
          if (components[key_1].connection_2[key_2].connection_4[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_2[key_2].componentId + "_outbound_2";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_in_2.push(getPosition(element));
          }
        }
      }
    }
    if (components[key_1].connection_3 !== false)
    {
      for (var key_2 in components[key_1].connection_3)
      {
        for (var key_3 in components[key_1].connection_3[key_2].connection_1)
        {
          if (components[key_1].connection_3[key_2].connection_1[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_3[key_2].componentId + "_inbound_1";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_out_1.push(getPosition(element));
          }
        }

        for (var key_3 in components[key_1].connection_3[key_2].connection_2)
        {
          if (components[key_1].connection_3[key_2].connection_2[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_3[key_2].componentId + "_inbound_2";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_out_1.push(getPosition(element));
          }
        }
      }
    }
    if (components[key_1].connection_4 !== false)
    {
      for (var key_2 in components[key_1].connection_4)
      {
        for (var key_3 in components[key_1].connection_4[key_2].connection_1)
        {
          if (components[key_1].connection_4[key_2].connection_1[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_4[key_2].componentId + "_inbound_1";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_out_2.push(getPosition(element));
          }
        }

        for (var key_3 in components[key_1].connection_4[key_2].connection_2)
        {
          if (components[key_1].connection_4[key_2].connection_2[key_3].componentId == components[key_1].componentId)
          {
            var id = components[key_1].connection_4[key_2].componentId + "_inbound_2";
            var element = document.getElementById(id);

            if (element != null && element != undefined)
              targets_out_2.push(getPosition(element));
          }
        }
      }
    }

    var originId = components[key_1].componentId;
    var target_tile = document.getElementById(originId);
    var originPos = getPosition(target_tile.children[originId + "_points"].children[originId + "_inbound_1"]);
    for (var key in targets_in_1)
    {
      lines += "<line class=\"connectionLine\" x1=\"" + add(originPos.x, 10) + "\" y1=\"" + add(originPos.y, 10) + "\" x2=\"" + add(targets_in_1[key].x, 10) + "\" y2=\"" + add(targets_in_1[key].y, 10) + "\"/>";
    }
    originPos = getPosition(target_tile.children[originId + "_points"].children[originId + "_inbound_2"]);
    for (var key in targets_in_2)
    {
      lines += "<line class=\"connectionLine\" x1=\"" + add(originPos.x, 10) + "\" y1=\"" + add(originPos.y, 10) + "\" x2=\"" + add(targets_in_2[key].x, 10) + "\" y2=\"" + add(targets_in_2[key].y, 10) + "\"/>";
    }
    originPos = getPosition(target_tile.children[originId + "_points"].children[originId + "_outbound_1"]);
    for (var key in targets_out_1)
    {
      lines += "<line class=\"connectionLine\" x1=\"" + add(originPos.x, 10) + "\" y1=\"" + add(originPos.y, 10) + "\" x2=\"" + add(targets_out_1[key].x, 10) + "\" y2=\"" + add(targets_out_1[key].y, 10) + "\"/>";
    }
    originPos = getPosition(target_tile.children[originId + "_points"].children[originId + "_outbound_2"]);
    for (var key in targets_out_2)
    {
      lines += "<line class=\"connectionLine\" x1=\"" + add(originPos.x, 10) + "\" y1=\"" + add(originPos.y, 10) + "\" x2=\"" + add(targets_out_2[key].x, 10) + "\" y2=\"" + add(targets_out_2[key].y, 10) + "\"/>";
    }
  }

  document.getElementById("lineContainer").innerHTML = "<svg class='lineContainer'>" + lines + "</svg>";
}

function clearConnections()
{
  document.getElementById("lineContainer").innerHTML = "";
}

function activateTile(id)
{
  target_tile = document.getElementById(id);
  if (components[target_tile.id].allowManualToggle && !connectionMode)
    components[target_tile.id].toggle();
}