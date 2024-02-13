export interface Champion {

    version : string;
    id : string;
    key : string;
    name : string;
    title : string;
    blurb : string;
    info : ChampionInfo;
    image : ChampionImage;
    tags : string[];
    partype : string;
    stats : ChampionStats;
}

interface ChampionInfo
{
    attack : string
    defense : string
    magic : string
    difficulty : string
}

interface ChampionImage
{
    full : string;
    sprite : string;
    group : string;
    x : number;
    y : number;
    w : number;
    h : number;
}

interface ChampionStats
{
    hp : number;
    hpperlevel : number;
    mp : number;
    mpperlevel : number;
    movespeed : number;
    armor : number;
    armorperlevel : number;
    spellblock : number;
    spellblockperlevel : number;
    attackrange : number;
    hpregen : number;
    hpregenperlevel : number;
    mpregen : number;
    mpregenperlevel : number;
    crit : number;
    critperlevel : number;
    attackdamage : number;
    attackdamageperlevel : number;
    attackspeedoffset : number;
    attackspeedperlevel : number;
}