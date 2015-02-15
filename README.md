# Starbound-wire-planner
Yes! Hi!
So this is a thing I made!

This is the current in-development version of my Starbound Wire Planner, or SWP for short, that I made because I couldn't find one.

FIRST, A DISCLAIMER! I'm not associated with Chucklefish in any way! The assets for the components are from the game, used with no permissions what-so-ever, but with no harm intended!
There are no ads on any of my sites.
Also, this is a prototype/experiment and it's not in a usable state right now. There are bugs and missing features.

Now, someone asked "What's the point" (paraphrased), and I can sort of see it since wiring in Starbound is relatively accessible.
But there are still some advantages to be had with an external tool, like say, having unlimited components, and unlimited reach cuts down on the time required.

It's also a fun challenge for me.

Now then, this program thingy works like this currently:

You have before you a grid of tiles (as they are referred to internally), and each tile can be assigned a component.
There are currently three components added: the Small Wall Switch, Bulb and the Persistent Switch.
The Wall Switch and the Bulb are fully operational, but the Persistent Switch has no logic in it yet and thus doesn't do anything.

To assign a component you left-click a tile and select "Set Component", then select the component from the list.
Once a component has been assigned, if you left-click the tile again the "Toggle Connections" option will be available, and "Toggle" will be available if the component allows manual toggling. (The Wall Switch does, but the Bulb and Persistent Switch doesn't)

"Toggle" simply turns the component on/off like you would by activating it in-game.
"Toggle Connections" will show the connection nodes for the component. You may then click a node which will display a dialogue showing a list of other components that have opposite nodes.
There is also "Current Connections" which will show a list of all components that are already connected to this node.
At the moment you cannot remove connections. This will obviously come soon.