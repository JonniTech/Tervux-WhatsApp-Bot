// Fun Commands
import { ship } from "./fun/ship.js";
import { fancy } from "./fun/fancy.js";
import { joke } from "./fun/joke.js";
import { fact } from "./fun/fact.js";
import { dare } from "./fun/dare.js";
import { truth } from "./fun/truth.js";
import { eightball } from "./fun/8ball.js";
import { pickup } from "./fun/pickup.js";
import { compliment } from "./fun/compliment.js";
import { roast } from "./fun/roast.js";
import { riddle } from "./fun/riddle.js";
import { hack } from "./fun/hack.js";
import { virus } from "./fun/virus.js";
import { crash } from "./fun/crash.js";
import { matrix } from "./fun/matrix.js";
import { detective } from "./fun/detective.js";
import { spam } from "./fun/spam.js";
import { rps } from "./fun/rps.js";
import { coinflip } from "./fun/coinflip.js";
import { dice } from "./fun/dice.js";
import { trivia } from "./fun/trivia.js";
import { confess } from "./fun/confess.js";
import { rate } from "./fun/rate.js";
import { flirt } from "./fun/flirt.js";
import { lovemsg } from "./fun/lovemsg.js";
import { loveletter } from "./fun/loveletter.js";
import { crush } from "./fun/crush.js";
import { goodmorning } from "./fun/goodmorning.js";
import { goodnight } from "./fun/goodnight.js";
import { compatibility } from "./fun/compatibility.js";
import { dateidea } from "./fun/dateidea.js";

// General Commands
import { help } from "./general/help.js";
import { ping } from "./general/ping.js";
import { botstats } from "./general/botstats.js";
import { owner } from "./general/owner.js";
import { block } from "./general/block.js";
import { unblock } from "./general/unblock.js";
import { creator } from "./general/creator.js";
import { quote } from "./general/quote.js";

// Media Commands
import { movie } from "./media/movie.js";
import { sport } from "./media/sport.js";
import { news } from "./media/news.js";
import { play } from "./media/play.js";
import { video } from "./media/video.js";
import { meme } from "./media/meme.js";
import { lyrics } from "./media/lyrics.js";
import { zodiac } from "./media/zodiac.js";
import { wallpaper } from "./media/wallpaper.js";
import { waifu } from "./media/waifu.js";

// Status Commands
import { status } from "./status/profile.js";
import { setbio } from "./status/setbio.js";
import { setname } from "./status/setname.js";

// Tool Commands
import { calc } from "./tools/calc.js";
import { qr } from "./tools/qr.js";
import { weather } from "./tools/weather.js";
import { translate } from "./tools/translate.js";
import { define } from "./tools/define.js";
import { aesthetic } from "./tools/aesthetic.js";
import { sticker } from "./tools/sticker.js";
import { github } from "./tools/github.js";
import { password } from "./tools/password.js";
import { wiki } from "./tools/wiki.js";
import { base64 } from "./tools/base64.js";
import { ip } from "./tools/ip.js";
import { ai } from "./tools/ai.js";

// Settings Commands
import { settings } from "./settings/settings.js";
import { prefix } from "./settings/prefix.js";
import {
    alwaysonline,
    autolikestatus,
    autoviewstatus,
    antidelete,
    anticall,
    autoread,
    alwaystyping,
    alwaysrecording
} from "./settings/toggles.js";

// Group Commands
import {
    hidetag,
    tagall,
    kick,
    add,
    promote,
    demote,
    mute,
    unmute,
    groupinfo,
    grouplink,
    revoke,
    leave,
    admins,
    setgroupname,
    setdesc,
    welcome,
    setwelcome,
    goodbye,
    setgoodbye,
    antilink,
    poll,
    warn,
    resetwarn,
    rejoin,
    groupantidelete
} from "./group/group.js";

export const commands = {
    // Fun Commands
    ship,
    fancy,
    joke,
    fact,
    dare,
    truth,
    "8ball": eightball,
    pickup,
    compliment,
    roast,
    riddle,
    hack,
    virus,
    crash,
    matrix,
    detective,
    spam,
    rps,
    coinflip,
    dice,
    trivia,
    confess,
    rate,
    flirt,
    lovemsg,
    loveletter,
    crush,
    goodmorning,
    goodnight,
    compatibility,
    dateidea,

    // General Commands
    help,
    ping,
    botstats,
    owner,
    block,
    unblock,
    creator,
    quote,

    // Media Commands
    movie,
    sport,
    news,
    play,
    video,
    meme,
    lyrics,
    zodiac,
    wallpaper,
    waifu,

    // Status Commands
    status,
    setbio,
    setname,

    // Tool Commands
    calc,
    qr,
    weather,
    translate,
    define,
    aesthetic,
    sticker,
    github,
    password,
    wiki,
    base64,
    ip,
    ai,

    // Settings & Toggle Commands
    settings,
    prefix,
    alwaysonline,
    autolikestatus,
    autoviewstatus,
    antidelete,
    anticall,
    autoread,
    alwaystyping,
    alwaysrecording,

    // Group Commands
    hidetag,
    tagall,
    kick,
    add,
    promote,
    demote,
    mute,
    unmute,
    groupinfo,
    grouplink,
    revoke,
    leave,
    admins,
    setgroupname,
    setdesc,
    welcome,
    setwelcome,
    goodbye,
    setgoodbye,
    antilink,
    poll,
    warn,
    resetwarn,
    rejoin,
    groupantidelete
};
