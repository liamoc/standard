var TileMovementHandler = MovementHandler.extend({
	movementStepsLeft: 0,
	moving: false,
	
	update: function()
	{
		if (Standard.inputPerson)
		{
			var x = GetPersonX(Standard.inputPerson);
			var y = GetPersonY(Standard.inputPerson);
			var layer = GetPersonLayer(Standard.inputPerson);
			if (this.movementStepsLeft)
			{
				this.movementStepsLeft--;
				QueuePersonCommand(Standard.inputPerson, this.moving, true);
				if (this.movementStepsLeft == 0)
				{
					AttachInput(Standard.inputPerson);
				}
			}
			else
			{
				this.moving = false;
				var face = false;
				if (IsKeyPressed(Config.controls.up))
				{
					if (!IsPersonObstructed(Standard.inputPerson, x, y - 16))
					{
						this.moving = COMMAND_MOVE_NORTH;
					}
					face = COMMAND_FACE_NORTH;
				}
				else if (IsKeyPressed(Config.controls.left))
				{
					if (!IsPersonObstructed(Standard.inputPerson, x - 16, y))
					{
						this.moving = COMMAND_MOVE_WEST;
					}
					face = COMMAND_FACE_WEST;
				}
				else if (IsKeyPressed(Config.controls.right))
				{
					if (!IsPersonObstructed(Standard.inputPerson, x + 16, y))
					{
						this.moving = COMMAND_MOVE_EAST;
					}
					face = COMMAND_FACE_EAST;
				}
				else if (IsKeyPressed(Config.controls.down))
				{
					if (!IsPersonObstructed(Standard.inputPerson, x, y + 16))
					{
						this.moving = COMMAND_MOVE_SOUTH;
					}
					face = COMMAND_FACE_SOUTH;
				}
				
				if (this.moving)
				{
					DetachInput();
					this.movementStepsLeft = GetTileWidth();
				}
				if (face) QueuePersonCommand(Standard.inputPerson, face, true);
			}
		}
	}
});