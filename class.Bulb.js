function Bulb(id)
{
  this.componentId = id;
  this.componentName = "Bulb";
  this.componentClassName = "bulb";

  this.connection_1 = []; //In 1
  this.connection_2 = false; //In 2
  this.connection_3 = false; //Out 1
  this.connection_4 = false; //Out 2
  this.connectionsVisible = false;

  this.texture = "assets/bulb.png";

  this.stateOff = "-48px 0px";
  this.stateOn = "0px 0px";

  this.currentState = "OFF";

  this.allowManualToggle = false;
}

Bulb.prototype.toggle = function()
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

Bulb.prototype.turnOn = function()
{
  this.currentState = "ON";
  document.getElementById(this.componentId).style.backgroundPosition = this.stateOn;
};

Bulb.prototype.turnOff = function()
{
  this.currentState = "OFF";
  document.getElementById(this.componentId).style.backgroundPosition = this.stateOff;
};

Bulb.prototype.inputUpdate = function(exclude)
{
  console.log("Bulb update triggered!");

  var state = false;
  for (var key in this.connection_1)
  {
    if (this.connection_1[key].currentState == "ON" && this.connection_1[key].componentId != exclude)
    {
      console.log("Bulb found ON connection!");
      state = true;
    }
  }


  if (state)
    this.turnOn();
  else
    this.turnOff();
};