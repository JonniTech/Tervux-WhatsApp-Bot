// Fun Commands
import { ship } from "./fun/ship.js";
import { fancy } from "./fun/fancy.js";
import { joke } from "./fun/joke.js";
import { fact } from "./fun/fact.js";
import { dare } from "./fun/dare.js";
import { truth } from "./fun/truth.js";

// General Commands
import { help } from "./general/help.js";
import { ping } from "./general/ping.js";
import { botstats } from "./general/botstats.js";
import { owner } from "./general/owner.js";
import { block } from "./general/block.js";
import { unblock } from "./general/unblock.js";

// Media Commands
import { movie } from "./media/movie.js";
import { sport } from "./media/sport.js";
import { news } from "./media/news.js";
import { play } from "./media/play.js";
import { video } from "./media/video.js";

// Status Commands
import { status } from "./status/profile.js";
import { setbio } from "./status/setbio.js";
import { setname } from "./status/setname.js";

// Tool Commands
import { calc } from "./tools/calc.js";
import { qr } from "./tools/qr.js";
import { weather } from "./tools/weather.js";
import { translate } from "./tools/translate.js";

// Settings Commands
import { settings } from "./settings/settings.js";
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
    rejoin
} from "./group/group.js";

export const commands = {
    // Fun Commands
    ship,
    fancy,
    joke,
    fact,
    dare,
    truth,

    // General Commands
    help,
    ping,
    botstats,
    owner,
    block,
    unblock,

    // Media Commands
    movie,
    sport,
    news,
    play,
    video,

    // Status Commands
    status,
    setbio,
    setname,

    // Tool Commands
    calc,
    qr,
    weather,
    translate,

    // Settings & Toggle Commands
    settings,
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
    rejoin
};
