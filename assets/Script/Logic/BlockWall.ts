import BlockTeam from "./BlockTeam";
import { Vector2Int } from "./Vector2Int";
import BlockTeam_I from "./BlockTeam_I";
import BlockTeam_O from "./BlockTeam_O";
import BlockTeam_T from "./BlockTeam_T";
import BlockTeam_J from "./BlockTeam_J";
import BlockTeam_L from "./BlockTeam_L";
import BlockTeam_P from "./BlockTeam_P";
import BlockTeam_Q from "./BlockTeam_Q";
import { Queue } from "../lib";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

export enum BlockColor  
{
     None,
     Gray,
     Red,
     Yellow,
     Green,
     Blue
};
export enum BT_Move_Type
    {
        BTM_None = 0,
        BTM_Left,
        BTM_Right,
        BTM_Down
    };

const {ccclass, property} = cc._decorator;

@ccclass
export class BlockWall extends cc.Component {

    static m_BlockTeamType:Array<BlockTeam> = new Array<BlockTeam>();
    static BlockWall()
    {
        this.m_BlockTeamType.push(new BlockTeam_I());
        this.m_BlockTeamType.push(new BlockTeam_J());
        this.m_BlockTeamType.push(new BlockTeam_L());
        this.m_BlockTeamType.push(new BlockTeam_O());
        this.m_BlockTeamType.push(new BlockTeam_P());
        this.m_BlockTeamType.push(new BlockTeam_Q());
        this.m_BlockTeamType.push(new BlockTeam_T());
    }

    m_WallData : number[][];
    m_CurBlockTeam:BlockTeam = null;
    m_DropDownBT:BlockTeam = null;
    m_BlockTeamQueue: Queue<BlockTeam> = new Queue<BlockTeam>();
    
    Reset():void
    {
        // for (var i = 0; i < m_WallData.GetLength(0); i++)
        // {
        //     for (int j = 0; j < m_WallData.GetLength(1); j++)
        //     {
        //         m_WallData[i, j] = 0;
        //     }
        // }
        this.m_WallData = [];
        this.m_CurBlockTeam = null;
        this.m_DropDownBT = null;
        this.m_BlockTeamQueue.clear();
    }

    public Start():void
    {
        this.Reset();
        this.EnqueueBlockTeam();
        this.EnqueueBlockTeam();
    }

    IsCollide(bt:BlockTeam,  eBTMove:BT_Move_Type = BT_Move_Type.BTM_None):boolean
    {
		if (bt == null)
			return true;
        var vPos:Vector2Int = bt.GetPos();
        switch (eBTMove)
        {
            case BT_Move_Type.BTM_Left:
                vPos.x -= 1;
                break;
            case BT_Move_Type.BTM_Right:
                vPos.x += 1;
                break;
            case BT_Move_Type.BTM_Down:
                vPos.y += 1;
                break;
            default:
                break;
        }
        for (var i:number = 0; i < bt.GetWidth(); i++)
        {
            for (var j:number = 0; j < bt.GetHeight(); j++)
            {
                var iBTValue:number, iWallValue:number;
                if (bt.GetValue(i, j, iBTValue))
                {
					if(iBTValue != 0)
                    {
						if(this.GetValue(i + vPos.x, j + vPos.y, iWallValue))
						{
							if (iWallValue != 0)
                                return true;
						}
						else
						{
							return true;
						}
                    }
                }
                else
                {
                    return true;
                }
            }
        }
        return false;
    }

GetRandomInt(min: number, max: number): number {  
    var Range = max - min;  
    var Rand = Math.random();  
    return(min + Math.round(Rand * Range));  
}

    EnqueueBlockTeam():void
    {
        var iIndex:number = this.GetRandomInt(0, BlockWall.m_BlockTeamType.length);
        var scrBt = BlockWall.m_BlockTeamType[iIndex];
        var bt = scrBt.Clone();
        this.m_BlockTeamQueue.enqueue(bt);
    }
    NewBlockTeam():void
    {
        this.EnqueueBlockTeam();
        var bt:BlockTeam = this.m_BlockTeamQueue.dequeue();
        this.InitBlockTeamPos(bt);
        this.m_CurBlockTeam = bt;
        this.m_DropDownBT = this.m_CurBlockTeam.Clone();
        this.m_CurBlockTeam.OnBlockMove = this.OnCurBlockTeamUpdate;
        this.m_CurBlockTeam.OnBlockRot = this.OnCurBlockTeamUpdate;
        this.OnCurBlockTeamUpdate();
    }

    OnCurBlockTeamUpdate():void
    {
        this.m_CurBlockTeam.CopyTo(this.m_DropDownBT);
        while (!this.IsCollide(this.m_DropDownBT, BT_Move_Type.BTM_Down))
        {
            this.m_DropDownBT.MoveDown();
        }
    }

    InitBlockTeamPos(bt:BlockTeam):void
    {
        var iX = (this.GetWidth() - bt.GetWidth()) / 2;
        var iY = 0 - bt.GetTopOffset();
        bt.SetPos(iX, iY);
    }

    public GetWidth():number
    {
        return 12;
    }

    public GetHeight():number
    {
        return 20;
    }

    GetValue( iX:number, iY:number, iValue:number):boolean
    {
        iValue = 0;
		if (iX >= this.GetWidth() || iY >= this.GetHeight() || iX<0 || iY<0)
            return false;

        iValue = this.m_WallData[iX][iY];
        return true;
    }

	public GetBlockColor( iX:number, iY:number,  blockColor: BlockColor):boolean
	{
		blockColor = BlockColor.None;
	    var iValue:number = 0;
		if(this.GetValue(iX,iY, iValue))
		{
            if (iValue != 0)
                blockColor = BlockColor.Gray;
            else
            {
				if (this.m_DropDownBT != null)
                {
                    var iBTX:number = iX - this.m_DropDownBT.GetPos().x;
                    var iBTY = iY - this.m_DropDownBT.GetPos().y;
                    if (this.m_DropDownBT.GetValue(iBTX, iBTY, iValue))
                    {
                        if (iValue != 0)
                            blockColor = BlockColor.Yellow;
                    }
                }

                if (this.m_CurBlockTeam != null)
                {
                    var iBTX = iX - this.m_CurBlockTeam.GetPos().x;
                    var iBTY = iY - this.m_CurBlockTeam.GetPos().y;
					if (this.m_CurBlockTeam.GetValue(iBTX, iBTY, iValue))
                    {
                        if (iValue != 0)
                            blockColor = BlockColor.Red;
                    }
                } 
            }
				
			return true;
		}
		else
			return false;
	}

    SetValue( iX,  iY, iValue):boolean
    {
        if (iX >= this.GetWidth() || iY >= this.GetHeight())
            return false;

        this.m_WallData[iX][iY] = iValue;
        return true;
    }

    

    public OnLeft()
    {
        var bt = this.m_CurBlockTeam;
        if (!this.IsCollide(bt, BT_Move_Type.BTM_Left))
            bt.MoveLeft();
    }

    public OnRight()
    {
        var bt = this.m_CurBlockTeam;
        if (!this.IsCollide(bt, BT_Move_Type.BTM_Right))
            bt.MoveRight();
    }

    public OnDown()
    {
        var bt = this.m_CurBlockTeam;
        if (!this.IsCollide(bt, BT_Move_Type.BTM_Down))
            bt.MoveDown();
        else
        {
            this.Merge(bt);
            this.m_CurBlockTeam = null;
            this.m_DropDownBT = null;
        }
    }
	public OnDrop()
	{
        if (this.m_DropDownBT == null || this.m_CurBlockTeam == null)
            return;
        this.m_DropDownBT.CopyTo(this.m_CurBlockTeam);
	}

    public OnRot()
    {
		if (this.m_CurBlockTeam == null)
			return;
        var bt = this.m_CurBlockTeam.Clone();
        bt.Rot();
        if (!this.IsCollide(bt, BT_Move_Type.BTM_None))
            this.m_CurBlockTeam.Rot();
        else
        {
            var btLeft = bt;
            var btRight = bt.Clone();
            for (var i = 0;i< bt.GetBlockWidth(); i++)
            {
                btLeft.MoveLeft();
                if (!this.IsCollide(btLeft, BT_Move_Type.BTM_None))
                {
                    this.m_CurBlockTeam.Rot();
                    for (var j = i;j>=0;j--)
                    {
                        this.m_CurBlockTeam.MoveLeft();
                    }
                    break;
                }
                btRight.MoveRight();
                if (!this.IsCollide(btRight, BT_Move_Type.BTM_None))
                {
                    this.m_CurBlockTeam.Rot();
                    for (var j = i; j >= 0; j--)
                    {
                        this.m_CurBlockTeam.MoveRight();
                    }
                    break;
                }
            }
        }
    }

    public OnTimer()
    {
        if (this.m_CurBlockTeam == null)
        {
            if(!this.Dispel())
                this.NewBlockTeam();
        }
        else
            this.OnDown();
    }

    Merge( bt: BlockTeam)
    {
        var vPos = bt.GetPos();
        for (var i = 0; i < bt.GetWidth(); i++)
        {
            for (var j = 0; j < bt.GetHeight(); j++)
            {
                var iBTValue;
                if (bt.GetValue(i, j,  iBTValue) )
                {
                    if (iBTValue == 1)
                        this.SetValue(i + vPos.x, j + vPos.y, iBTValue);
                }
            }
        }
    }

    Dispel(): boolean
    {
        var bDispel = false;
		var iIndex = this.GetHeight() - 1;
        while (iIndex >= 0)
        {
			var bContuine = false;
			for (var i = 0;i<this.GetWidth();i++)
            {
                var iValue;
				if (this.GetValue(i, iIndex,iValue))
                {
					if(iValue == 0)
					{
						bContuine = true;
						break;
					}
                }
				else
				{
					bContuine = true;
					break;
				}
            }
			if (bContuine)
			{
				iIndex--;
				continue;
			}
			
            for (var j = iIndex;j>=0;j--)
            {
				for (var i = 0; i < this.GetWidth(); i++)
                {
                    if (j - 1 >= 0)
                        this.m_WallData[i][j] = this.m_WallData[i][j-1];
                    else
                        this.m_WallData[i][j] = 0;
                }
            }
            bDispel = true;

        }
        return bDispel;
    }
}
