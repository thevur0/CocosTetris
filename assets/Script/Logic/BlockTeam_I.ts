import BlockTeam from "./BlockTeam";
import { BlockWall } from "./BlockWall";
// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockTeam_I extends BlockTeam  {

    static BlockTeam_I()
    {
        var vPos : number[][] = [
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0],
                [0,0,1,0]];

                BlockTeam_I.ms_RotPosData.push(vPos);
        
        var vPos1 : number[][] = [
            [0,0,0,0],
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0]];

            BlockTeam_I.ms_RotPosData.push(vPos1);
    }
    public Clone():BlockTeam
    {
        var bt:BlockTeam = new BlockTeam_I();
		bt.SetPos(this.GetPos().x, this.GetPos().y);
        bt.SetRotIndex(this.m_iIndexPos);
        return bt;
    }
    
    private static ms_RotPosData : Array<number[][]> = new Array<number[][]>();
    protected GetRotData(): Array<number[][]> { return BlockTeam_I.ms_RotPosData; }
}
