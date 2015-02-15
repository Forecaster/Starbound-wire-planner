function PersistentSwitch(id)
{
  this.componentId = id;
  this.componentName = "Persistent Switch";

  this.connection_1 = [];
  this.connection_2 = [];
  this.connection_3 = [];
  this.connection_4 = false;
  this.connectionsVisible = false;

  this.texture = "assets/persistentswitch.png";

  this.stateOff = "0px 0px";
  this.stateOn = "-96px 0px";

  this.currentState = "OFF";

  this.allowManualToggle = false;
}

PersistentSwitch.prototype.toggle = function()
{
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
};