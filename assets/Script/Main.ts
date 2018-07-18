import RenderUtil from "./Render/RenderUtil";
import { BlockWall } from "./Logic/BlockWall";
import BlockTeam_I from "./Logic/BlockTeam_I";
import BlockTeam_J from "./Logic/BlockTeam_J";
import BlockTeam_T from "./Logic/BlockTeam_T";
import BlockTeam_O from "./Logic/BlockTeam_O";
import BlockTeam_L from "./Logic/BlockTeam_L";
import BlockTeam_P from "./Logic/BlockTeam_P";
import BlockTeam_Q from "./Logic/BlockTeam_Q";

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
export default class Main extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.CheckMouse, this);

         this.node.on(cc.Node.EventType.TOUCH_MOVE,this.CheckMouse, this);

         this.node.on(cc.Node.EventType.TOUCH_END, this.CheckMouse, this);   
    }


    update (dt) {this.FixedUpdate();}


	// Use this for initialization
	m_BlockItem : cc.Node;
	m_Sprites : cc.Sprite[][] =[];
    m_BlockWall:BlockWall = new BlockWall();

    InitBT()
    {
        BlockWall.BlockWall();
        BlockTeam_I.BlockTeam_I();
        BlockTeam_T.BlockTeam_T();
        BlockTeam_O.BlockTeam_O();
        BlockTeam_J.BlockTeam_J();
        BlockTeam_L.BlockTeam_L();
        BlockTeam_P.BlockTeam_P();
        BlockTeam_Q.BlockTeam_Q();
    }
	InitSprites()
	{
        
        this.m_BlockItem = cc.find("Canvas/blockitem");
        var spriteFrame:cc.SpriteFrame = this.m_BlockItem.getComponent(cc.Sprite).spriteFrame;
        var tranParent:cc.Node = cc.find("Canvas/blockparent");
		for (var i = 0; i < this.m_BlockWall.GetWidth();i++)
		{
            this.m_Sprites[i] = [];
			for (var j = 0; j < this.m_BlockWall.GetHeight();j++)
			{
                var go = new cc.Node();
                tranParent.addChild(go);
                this.m_Sprites[i][j] = go.addComponent(cc.Sprite);
                this.m_Sprites[i][j].enabled = false;
                this.m_Sprites[i][j].spriteFrame = spriteFrame;
                go.setContentSize(36,36);
                var pos:cc.Vec2 = this.m_BlockItem.position;
				pos.x = pos.x + i * 36;
                pos.y = pos.y - j * 36;
				go.position = pos;
			}
		}
	}
	start () {

        this.InitBT();
		this.InitSprites();
        this.InitTimer();

    }
	// Update is called once per frame
	m_bUpdate:boolean = false;
    FixedUpdate () {
		if (this.m_bUpdate)
		{
			this.m_BlockWall.OnTimer();
			RenderUtil.UpdateBlockWall(this.m_BlockWall, this.m_Sprites);
			this.m_bUpdate = false;
		}
    }

    
    public OnGameStart()
    {
        this.m_BlockWall.Start();
        this.StartTimer();
    }
    public OnPauseGame()
    {
        if (this.m_bTimerEnable)
            this.StopTimer();
        else
            this.StartTimer();
    }
    InitTimer()
    {
    }

    m_bTimerEnable : boolean = false;
    StartTimer()
    {
        this.schedule(this.OnTimer,1);
        this.m_bTimerEnable = true;
    }

    OnTimer()
    {
		this.m_bUpdate = true;   
    }

    StopTimer()
    {
        this.unschedule(this.OnTimer);
        this.m_bTimerEnable = false;
    }


    OnClick()
    {
		this.m_BlockWall.OnRot();
		RenderUtil.UpdateBlockWall(this.m_BlockWall, this.m_Sprites);
    }
    OnLeftMove()
    {
		this.m_BlockWall.OnLeft();
		RenderUtil.UpdateBlockWall(this.m_BlockWall, this.m_Sprites);
    }
    OnRightMove()
    {
		this.m_BlockWall.OnRight();
		RenderUtil.UpdateBlockWall(this.m_BlockWall, this.m_Sprites);
    }
    OnDropDown()
    {
		this.m_BlockWall.OnDrop();
		RenderUtil.UpdateBlockWall(this.m_BlockWall, this.m_Sprites);
    }
    m_bGetBeginPos:boolean = false;
    m_BeginPosition : cc.Vec2 = cc.Vec2.ZERO;
    readonly m_fCheckTime:number = 0.0;
    m_fSaveTime:number = 0.0;
    readonly m_fMoveDis:number = 40.0;
	m_bMove:boolean = false;
    CheckMouse(event : cc.Event.EventTouch)
    {
        var touchVec : cc.Vec2 =  event.touch.getDelta();
        //var touchVec : cc.Vec2 =  this.node.convertTouchToNodeSpace(event.touch);
        if (event.type == cc.Node.EventType.TOUCH_START)
        {
			this.m_bMove = false;
            this.m_fSaveTime = 0;
            if (this.m_bGetBeginPos)
            {
                this.m_BeginPosition = touchVec;
                this.m_bGetBeginPos = false;
            }
        }
        if (event.type == cc.Node.EventType.TOUCH_MOVE)
        {
            //this.m_fSaveTime += cc.delayTime(1).;
            //if (this.m_fSaveTime > this.m_fCheckTime)
            {
                var vDis: cc.Vec2 = cc.Vec2.ZERO;
                vDis.x = touchVec.x - this.m_BeginPosition.x;
                vDis.y = touchVec.y - this.m_BeginPosition.y;
				if (Math.abs(vDis.x) > this.m_fMoveDis && Math.abs(vDis.y) < Math.abs(vDis.x))
                {
                    if (vDis.x < 0)
                        this.OnLeftMove();
                    else
                        this.OnRightMove();
                    this.m_BeginPosition = touchVec;
                    this.m_bMove = true;
                }
            }
        }
        if (event.type == cc.Node.EventType.TOUCH_END)
        {
            this.m_bGetBeginPos = true;
			if (!this.m_bMove)
            {
                var vDis : cc.Vec2 = cc.Vec2.ZERO;
                vDis.x  = touchVec.x - this.m_BeginPosition.x;
                vDis.y  = touchVec.y - this.m_BeginPosition.y;
                if (Math.abs(vDis.x) > Math.abs(vDis.x) * 3.0 / 2.0)
                {
                    this.OnDropDown();
                }
                else //if (m_fSaveTime < m_fCheckTime) 
                {
                    this.OnClick();
                }
            }
        }
    }
}
