var TileMovementHandler = MovementHandler.extend({
	movementStepsLeft: 0,
	moving: false,
	
	update: function()
	{
		if (Standard.inputPerson)
		{

			if (this.movementStepsLeft)
			{
				this.movementStepsLeft--;
				if (this.movementStepsLeft == 0)
				{
					AttachInput(Standard.inputPerson);
				}
			}
			else
			{
				var x = GetPersonX(Standard.inputPerson);
				var y = GetPersonY(Standard.inputPerson);
				var layer = GetPersonLayer(Standard.inputPerson);
				this.moving = false;
				var face = false;
				if (IsKeyPressed(Config.controls.up))
				{
					if (!IsPersonObstructed(Standard.inputPerson, x, y - 16) && y > 8)
					{
						this.moving = COMMAND_MOVE_NORTH;
					}
					face = COMMAND_FACE_NORTH;
				}
				else if (IsKeyPressed(Config.controls.left) && x > 8)
				{
					if (!IsPersonObstructed(Standard.inputPerson, x - 16, y))
					{
						this.moving = COMMAND_MOVE_WEST;
					}
					face = COMMAND_FACE_WEST;
				}
				else if (IsKeyPressed(Config.controls.right) && x < GetLayerWidth(GetPersonLayer(Standard.inputPerson)) * GetTileWidth() - 8)
				{
					if (!IsPersonObstructed(Standard.inputPerson, x + 16, y))
					{
						this.moving = COMMAND_MOVE_EAST;
					}
					face = COMMAND_FACE_EAST;
				}
				else if (IsKeyPressed(Config.controls.down) && y < GetLayerHeight(GetPersonLayer(Standard.inputPerson)) * GetTileHeight() - 8)
				{
					if (!IsPersonObstructed(Standard.inputPerson, x, y + 16))
					{
						this.moving = COMMAND_MOVE_SOUTH;
					}
					face = COMMAND_FACE_SOUTH;
				}
				if (face) QueuePersonCommand(Standard.inputPerson, face, true);
				if (this.moving)
				{
					DetachInput();
					this.movementStepsLeft = GetTileWidth();
					for (var i = 0; i < 16; i++)
						QueuePersonCommand(Standard.inputPerson, this.moving, false)
				}
				
			}
		}
	}
});