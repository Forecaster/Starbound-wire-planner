function PersistentSwitch(id)
{
  this.componentId = id;
  this.componentName = "Persistent Switch";
  this.componentClassName = "persistentSwitch";

  this.connection_1 = []; //In 1
  this.connection_2 = []; //In 2
  this.connection_3 = []; //Out 1
  this.connection_4 = false; //Out 2
  this.connectionsVisible = false;

  this.texture = "assets/persistentswitch.png";

  this.stateOff = "-48px 0px";
  this.stateOn = "0px 0px";

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

PersistentSwitch.prototype.turnOn = function()
{
  this.currentState = "ON";
  document.getElementById(this.componentId).style.backgroundPosition = this.stateOn;
};

PersistentSwitch.prototype.turnOff = function()
{
  this.currentState = "OFF";
  document.getElementById(this.componentId).style.backgroundPosition = this.stateOff;
};

PersistentSwitch.prototype.inputUpdate = function(exclude)
{
  console.log("PersistentSwitch update triggered!");
  var state = false;
  if (this.currentState == "ON")
    state = true;
  for (var key in this.connection_1)
  {
    if (this.connection_1[key].currentState == "ON" && this.connection_1[key].componentId != exclude)
    {
      console.log("PersistentSwitch found ON connection on input!");
      state = true;
    }
  }

  for (var key in this.connection_2)
  {
    if (this.connection_2[key].currentState == "ON" && this.connection_2[key].componentId != exclude)
    {
      console.log("PersistentSwitch found ON connection on reset!");
      state = false;
    }
  }

  if (state)
  {
    this.turnOn();

    for (var key in this.connection_3)
    {
      this.connection_3[key].inputUpdate();
    }
  }
  else
  {
    this.turnOff();

    for (var key in this.connection_3)
    {
      this.connection_3[key].inputUpdate();
    }
  }
};