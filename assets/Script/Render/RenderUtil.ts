import { Dictionary } from "../lib";
import {BlockWall,BlockColor} from "../Logic/BlockWall";
//import {} from "../Logic/BlockWall";

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
export default class RenderUtil {
    
    private static  m_dicColor:Dictionary<BlockColor, cc.Color> = new Dictionary<BlockColor, cc.Color>();
    static RenderUtil()
    {
		RenderUtil.m_dicColor.setValue(BlockColor.Gray,cc.Color.GRAY);
        RenderUtil.m_dicColor.setValue(BlockColor.Red, cc.color(230,80,80,255));
		RenderUtil.m_dicColor.setValue(BlockColor.Yellow, cc.color(200,230,80,140));
    }
    public static  UpdateBlockWall( bw:BlockWall, sp: cc.Sprite[][])
	{
		for (var i = 0; i < bw.GetWidth();i++)
		{
			for (var j = 0; j < bw.GetHeight();j++)
			{
				var btColor : BlockColor[]=[BlockColor.None];
				if (bw.GetBlockColor(i, j, btColor))
				{
					sp[i][j].enabled = btColor[0] != BlockColor.None;
					var dicColor = RenderUtil.m_dicColor;
                    if(dicColor.containsKey(btColor[0]))
                    {
                        sp[i][j].node.color = dicColor.getValue(btColor[0]);
                    }
                    
				}
				else
					sp[i][j].enabled = false;
			}
		}
	}
}
