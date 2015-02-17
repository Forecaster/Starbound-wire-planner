function SmallWallSwitch(id)
{
  this.componentId = id;
  this.componentName = "Small Wall Switch";
  this.componentClassName = "smallWallSwitch";

  this.connection_1 = []; //In 1
  this.connection_2 = false; //In 2
  this.connection_3 = []; //Out 1
  this.connection_4 = false; //Out 2
  this.connectionsVisible = false;

  this.texture = "assets/smallwallswitch.png";

  this.stateOff = "0px 0px";
  this.stateOn = "-96px 0px";

  this.currentState = "OFF";

  this.allowManualToggle = true;
}

SmallWallSwitch.prototype.toggle = function()
{
  console.log("Small Switch toggled!");
  if (this.currentState == "OFF")
  {
    this.currentState = "ON";
    document.getElementById(this.componentId).style.backgroundPosition = this.stateOn;
  }
  else if (this.currentState == "ON")
  {
    this.currentState = "OFF";
    document.getElementById(this.componentId).style.backgroundPosition = this.stateOff;
  }

  for (var key in this.connection_3)
  {
    console.log("Update sent on connection_3 to " + this.connection_3[key].componentId);
    this.connection_3[key].inputUpdate();
  }
};

SmallWallSwitch.prototype.inputUpdate = function(exclude)
{
  //TODO: Update actions
};