var startX = 0;
var startY = 0;
var offsetX = 0;
var offsetY = 0;

var dragElement = null;
var lineOriginElement = null;
var originPointType = null;

var oldZIndex = 0;

var shift = 0;

document.onmousedown = onMouseDown;
document.onmouseup = onMouseUp;

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;

function extractNumber(value)
{
  var n = parseInt(value);
  
  if (n == null || isNaN(n))
    return 0;
  else
    return n;
}

function getPosition(element)
{
  var xPosition = 0;
  var yPosition = 0;
  
  while(element)
  {
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }
  return { x: xPosition, y: yPosition };
}

function onKeyDown(e)
{
  if (e.key == "Shift")
    shift = 1;
}

function onKeyUp(e)
{
  if (e.key == "Shift")
    shift = 0;
}

function onMouseDown(e)
{
  if (e.target != null)
    var target = e.target;
  else
    var target = e.srcElement;
  
  if (e.button == 0)
  {
    if (target.className == "component")
    {
      //selectedFuelItem = parseInt(target.id.substr(target.id.length -1), 10);
      //selectedFuelItem += fuelMenuSteps;
      
      dragElement = target;

      dragElement.style.zIndex = 500;

      startX = e.clientX;
      startY = e.clientY;

      offsetX = extractNumber(target.style.left);
      offsetY = extractNumber(target.style.top);

      //document.getElementById("debug").innerHTML = "startX: " + startX + "<br>startY: " + startY + "<br>offsetX: " + offsetX + "<br>offsetY: " + offsetY + "<br>X: " + e.clientX + "<br>Y: " + e.clientY;

      document.onmousemove = onMouseMove;

      document.body.focus();

      return false;
    }
    else if (target.className.indexOf("point_inbound") > -1 || target.className.indexOf("point_outbound") > -1)
    {
      if (target.className.indexOf("point_inbound") > -1)
        originPointType = "in";
      else if (target.className.indexOf("point_outbound") > -1)
        originPointType = "out";

      var connectionLine = document.getElementById("newConnectionLine");
      if (connectionLine != null)
      {
        lineOriginElement = target;

        //connectionLine.x1 = getPosition(lineOriginElement) + 10;
        //connectionLine.y1 = getPosition(lineOriginElement) + 10;
        connectionLine.setAttribute("x1", getPosition(lineOriginElement).x + 10);
        connectionLine.setAttribute("y1", getPosition(lineOriginElement).y + 10);
        connectionLine.setAttribute("x2", getPosition(lineOriginElement).x + 10);
        connectionLine.setAttribute("y2", getPosition(lineOriginElement).y + 10);
      }
      else
        console.log("Connection line was null!");

      document.onmousemove = onMouseMove;

      document.body.focus();
    }
  }
}

function onMouseMove(e)
{
  if (e == null)
    var e = window.event;
      
  //document.getElementById("debug").innerHTML = "startX: " + startX + "<br>startY: " + startY + "<br>offsetX: " + offsetX + "<br>offsetY: " + offsetY + "<br>X: " + e.clientX + "<br>Y: " + e.clientY;
  
  if (dragElement != null)
  {
    dragElement.style.left = (offsetX + e.clientX - startX) + "px";
    dragElement.style.top = (offsetY + e.clientY - startY) + "px";
  }
  else if (lineOriginElement != null)
  {
    var connectionLine = document.getElementById("newConnectionLine");
    //connectionLine.x2 = e.clientX;
    //connectionLine.y2 = e.clientY;
    connectionLine.setAttribute("x2", e.clientX.toString());
    connectionLine.setAttribute("y2", e.clientY.toString());
  }
}

function onMouseUp(e)
{
  if (dragElement != null)
  {
    var tiles = document.getElementsByClassName("tile");

    for (var key_1 in tiles)
    {
      if (tiles[key_1] != undefined)
      {
        var xOK = false;
        var yOK = false;
        var pos = getPosition(tiles[key_1]);

        if (e.button == 0)
        {
          if (e.clientX < (pos.x + 48) && e.clientX > pos.x)
            xOK = true;

          if (e.clientY < (pos.y + 48) && e.clientY > pos.y)
            yOK = true;

          if (dragElement != null && xOK && yOK)
          {
            dragElement.style.top = null;
            dragElement.style.left = null;

            target_tile = tiles[key_1];
            setTileToComponent(dragElement.id.replace("component_", ""));
            dragElement.style.zIndex = null;
            break;
          }
          else if (dragElement != null)
          {
            dragElement.style.top = null;
            dragElement.style.left = null;
          }
        }
        //else if (e.button == 1)
        //{
        //  if (e.clientX < (pos.x + 48) && e.clientX > pos.x)
        //    xOK = true;
        //
        //  if (e.clientY < (pos.y + 48) && e.clientY > pos.y)
        //    yOK = true;
        //}
      }
    }
    dragElement = null;
    document.onmousemove = null;
  }
  else if (lineOriginElement != null)
  {
    var xOK = false;
    var yOK = false;
    var targetPoint = null;
    if (originPointType == "out")
    {
      var points = document.getElementsByClassName("point_inbound point_tl");

      for (var key_1 in points)
      {
        if (points[key_1].id != null)
        {
          var pos = getPosition(points[key_1]);
          console.log("Currently testing " + points[key_1].id);

          console.log("X: " + pos.x + " < " + e.clientX + " && " + e.clientX + " < " + (pos.x + 20));
          if (pos.x < e.clientX && e.clientX < (pos.x + 20))
          {
            xOK = true;
            console.log("X TRUE");
          }

          console.log("Y: " + pos.y + " < " + e.clientY + " && " + e.clientY + " < " + (pos.y + 20));
          if (pos.y < e.clientY && e.clientY < (pos.y + 20))
          {
            yOK = true;
            console.log("Y TRUE");
          }

          if (xOK && yOK)
          {
            targetPoint = points[key_1];
            console.log("targetPoint set to " + points[key_1].id);
            break;
          }
          else
          {
            xOK = false;
            yOK = false;
          }
        }
      }

      console.log("End of loop 1: " + xOK + ", " + yOK);
      points = document.getElementsByClassName("point_inbound point_bl");

      if (!xOK || !yOK)
      {
        for (var key_1 in points)
        {
          if (points[key_1].id != null)
          {
            var pos = getPosition(points[key_1]);

            if (pos.x < e.clientX && e.clientX < (pos.x + 20))
              xOK = true;

            if (pos.y < e.clientY && e.clientY < (pos.y + 20))
              yOK = true;

            if (xOK && yOK)
            {
              targetPoint = points[key_1];
              console.log("targetPoint set to " + points[key_1].id);
              break;
            }
            else
            {
              xOK = false;
              yOK = false;
            }
          }
        }
      }
      console.log("End of loop 2: " + xOK + ", " + yOK);
    }
    else if (originPointType == "in")
    {
      if (!xOK || !yOK)
      {
        points = document.getElementsByClassName("point_outbound point_br");

        for (var key_1 in points)
        {
          if (points[key_1].id != null)
          {
            var pos = getPosition(points[key_1]);

            if (pos.x < e.clientX && e.clientX < (pos.x + 20))
              xOK = true;

            if (pos.y < e.clientY && e.clientY < (pos.y + 20))
              yOK = true;

            if (xOK && yOK)
            {
              targetPoint = points[key_1];
              console.log("targetPoint set to " + points[key_1].id);
              break;
            }
            else
            {
              xOK = false;
              yOK = false;
            }
          }
        }
      }
      console.log("End of loop 3: " + xOK + ", " + yOK);

      if (!xOK || !yOK)
      {
        points = document.getElementsByClassName("point_outbound point_tr");

        for (var key_1 in points)
        {
          if (points[key_1].id != null)
          {
            var pos = getPosition(points[key_1]);

            if (pos.x < e.clientX && e.clientX < (pos.x + 20))
              xOK = true;

            if (pos.y < e.clientY && e.clientY < (pos.y + 20))
              yOK = true;

            if (xOK && yOK)
            {
              targetPoint = points[key_1];
              console.log("targetPoint set to " + points[key_1].id);
              break;
            }
            else
            {
              xOK = false;
              yOK = false;
            }
          }
        }
      }
      console.log("End of loop 4: " + xOK + ", " + yOK);
    }

    if (lineOriginElement != null && xOK && yOK)
    {
      console.log("Connect " + lineOriginElement.parentNode.parentNode.id + " with " + targetPoint.parentNode.parentNode.id);
      console.log("Finding component " + lineOriginElement.parentNode.parentNode.id);
      var originComponent = components[lineOriginElement.parentNode.parentNode.id];
      console.log("Finding component " + targetPoint.parentNode.parentNode.id);
      var targetComponent = components[targetPoint.parentNode.parentNode.id];

      if (targetComponent != null && originComponent != null)
        connectComponents(originComponent, targetComponent, lineOriginElement.id.substr(-1, 1), targetPoint.id.substr(-1, 1));
      else if (targetComponent == null && originComponent == null)
        console.error("Target and origin component was null");
      else if (targetComponent == null)
        console.error("Target component was null");
      else if (originComponent == null)
        console.error("Origin component was null");
    }
    else if (lineOriginElement != null)
    {
      console.log("It seems there is no point here...");
    }

    var connectionLine = document.getElementById("newConnectionLine");
    connectionLine.setAttribute("x1", "0");
    connectionLine.setAttribute("y1", "0");
    connectionLine.setAttribute("x2", "0");
    connectionLine.setAttribute("y2", "0");

    lineOriginElement = null;
  }
}