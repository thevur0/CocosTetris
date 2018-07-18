import { Vector2Int } from "./Vector2Int";
import BaseBlock from "./BaseBlock";

const {ccclass, property} = cc._decorator;

enum BlockIndex { BI_First = 0, BI_Second, BI_Third,BI_Torth,BI_Count} ;
enum BlockTeamType {BTT_None,BTT_I,BTT_O,BTT_T,BTT_J,BTT_L,BTT_P,BTT_Q};
interface ActionBTMove
{
    ():void;
}
interface ActionBTRot
{
    ():void;
}

@ccclass
export default abstract class BlockTeam {

    public  Target:any = null;
    public  OnBlockMove :ActionBTMove = null;
    public  OnBlockRot : ActionBTRot = null;

    private m_BlockList : Array<BaseBlock>;
    protected m_iIndexPos : number = 0;
    private m_Pos : Vector2Int = new Vector2Int();
    protected m_BTType : BlockTeamType = BlockTeamType.BTT_None;
    public Rot():void
    {
        this.m_iIndexPos++;
		if (this.m_iIndexPos >= this.GetRotData().length)
            this.m_iIndexPos = 0;
        if(this.Target!=null)
        {
            this.Target.OnBlockRot = this.OnBlockRot;
            if (this.Target.OnBlockRot != null)
                this.Target.OnBlockRot();
        }
    }

    private CurrentPos(): number[][]
    {
		return this.GetRotData()[this.m_iIndexPos];
    }

    public SetPos(iX :number, iY: number):void
    {
        this.m_Pos.x = iX;
        this.m_Pos.y = iY;
    }
    public GetPos(): Vector2Int
    {
        return this.m_Pos;
    }
    public GetWidth():number
    {
        return BlockIndex.BI_Count;
    }
    public GetHeight():number
    {
        return BlockIndex.BI_Count;
    }
    public GetBlockWidth():number
    {
        var iWidth :number = 0;
        var vPos:number[][] = this.CurrentPos();
        for (var i:number = 0; i < this.GetHeight(); i++)
        {
            var iSum:number = 0;
            for (var j:number = 0; j < this.GetWidth(); j++)
            {
                iSum += vPos[j][i];
            }
            if (iSum != 0)
            {
                iWidth++;
            }
        }
        return iWidth;
    }
    public GetTopOffset():number
    {
        var vPos : number[][] = this.CurrentPos();
        var iIndex:number = 0;
        for (var i:number = 0;i<this.GetWidth();i++)
        {
            var iSum:number = 0;
            for (var j:number = 0;j <this.GetHeight();j++)
            {
                iSum += vPos[i][j];
            }
            if (iSum != 0)
            {
                return iIndex;
            }
            else
            {
                iIndex++;
            }
        }
        return iIndex;
    }
    public CopyTo(bt : BlockTeam):void
    {
        bt.SetPos(this.GetPos().x, this.GetPos().y);
        bt.SetRotIndex(this.m_iIndexPos);
    }

    public GetValue(iX:number, iY:number,iValue:number[]):boolean
    {
        iValue[0] = 0;
		if (iX >= this.GetWidth() || iY >= this.GetHeight() || iX < 0 || iY<0)
            return false;

		iValue[0] = this.CurrentPos()[iX][iY];
        return true;
    }

    public MoveLeft():void
    {
        this.m_Pos.x -= 1;
        if(this.Target!=null)
        {
            this.Target.OnBlockMove=this.OnBlockMove;
            if(this.Target.OnBlockMove!=null)
                this.Target.OnBlockMove();
        }
    }

    public MoveRight():void
    {
        this.m_Pos.x += 1;
        if(this.Target!=null)
        {
            this.Target.OnBlockMove=this.OnBlockMove;
            if (this.Target.OnBlockMove != null)
                this.Target.OnBlockMove();
        }
    }

    public MoveDown():void
    {
        this.m_Pos.y += 1;
    }

   
	public SetRotIndex(iIndex:number):void
	{
        this.m_iIndexPos = iIndex;
        if(this.Target!=null)
        {
            this.Target.OnBlockRot=this.OnBlockRot;
            if (this.Target.OnBlockRot != null)
                this.Target.OnBlockRot();
        }

    }

    public abstract Clone(): BlockTeam;
    protected abstract GetRotData() : Array<number[][]>;
}
