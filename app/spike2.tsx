import { StyleSheet, View, Text, FlatList, Image, useColorScheme, Pressable, Modal, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageCircle, RefreshCw, Heart, MoreHorizontal, Link, UserPlus, Ban } from "lucide-react-native";
import { useState, useRef, useEffect } from "react";

// Color palettes
const lightColors = {
  background: "#fff",
  text: "#14171a",
  textMuted: "#657786",
  border: "#e1e8ed",
};

const darkColors = {
  background: "#121212",
  text: "#f7f9f9",
  textMuted: "#8899a6",
  border: "#2a2a2a",
};

const getColors = (scheme: 'light' | 'dark' | null | undefined) => {
  return scheme === 'dark' ? darkColors : lightColors;
};

// Sample data based on the API structure
const SAMPLE_POSTS = [
  {
    id: "https://mastodon.social/users/Gargron/statuses/115720375105905292",
    type: 0,
    content: "<p>Baked some gingerbread cookies.</p>",
    url: "https://mastodon.social/@Gargron/115720375105905292",
    publishedAt: "2025-12-14T22:53:13.000Z",
    likeCount: 15,
    replyCount: 12,
    repostCount: 9,
    likedByMe: true,
    repostedByMe: false,
    attachments: [
      {
        type: "Document",
        mediaType: "image/jpeg",
        name: "Gingerbread cookies in the shapes of birds, stars, pine trees, candy canes, angels and more cooling down on a plate.",
        url: "https://files.mastodon.social/media_attachments/files/115/720/370/145/725/786/original/734839229f1ccafa.jpeg",
      },
    ],
    author: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://troet.cafe/users/kaychristianheine/statuses/115722212846371038",
    type: 0,
    content: "<p>Ist schon ein paar Tage her, aber analoge Fotografie braucht eben ein bisschen Geduld: erster Schnee am Morgen des 24. November.</p><p>#ersterSchnee #neuschnee #schnee #snow #freshsnow #analogfotografie #analogphotography #35mm #ishootfilm #shootfilm #nikonf4s #afnikkor50mmf18d #kodakektar100 #kodakfilm</p>",
    url: "https://troet.cafe/@kaychristianheine/115722212846371038",
    publishedAt: "2025-12-15T06:40:35.000Z",
    likeCount: 16,
    replyCount: 0,
    repostCount: 12,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "323567",
      handle: "@kaychristianheine@troet.cafe",
      name: "Kay-Christian Heine",
      url: "https://troet.cafe/@kaychristianheine",
      avatarUrl: "https://media.troet.cafe/troet.cafe/accounts/avatars/000/042/006/original/d9f2bfeb744efacc.jpg",
    },
    repostedBy: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://cosocial.ca/users/evan/statuses/115721863612706715",
    type: 0,
    content: "<p>Today, we went to Parc Lahaie and bought a Christmas tree. I made us fondue au fromage, and then we watched Guerre des Tuques together. It was a good winter's day in Montreal.</p>",
    url: "https://cosocial.ca/@evan/115721863612706715",
    publishedAt: "2025-12-15T05:11:46.000Z",
    likeCount: 9,
    replyCount: 2,
    repostCount: 2,
    likedByMe: false,
    repostedByMe: true,
    author: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://mastodon.social/users/NoveltyBot/statuses/115721822469252737",
    type: 0,
    content: "<p>Mammoth Long Tongue<br />only 12¢ from Johnson Smith and Co (1951)</p>",
    url: "https://mastodon.social/@NoveltyBot/115721822469252737",
    publishedAt: "2025-12-15T05:01:18.000Z",
    likeCount: 4,
    replyCount: 0,
    repostCount: 5,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "3809",
      handle: "@NoveltyBot@mastodon.social",
      name: "A Most Amusing Bot",
      url: "https://mastodon.social/@NoveltyBot",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/113/637/311/352/384/365/original/e906e84d5f59eef2.png",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://thecanadian.social/users/MostlyHarmless/statuses/115719438388136861",
    type: 0,
    content: "<p>Seven swans to rule them all<br />Six geese to find them.<br />Five rings to bring them all,<br />And in the pear tree<br />Bind them.</p>",
    url: "https://thecanadian.social/@MostlyHarmless/115719438388136861",
    publishedAt: "2025-12-14T18:55:00.000Z",
    likeCount: 0,
    replyCount: 4,
    repostCount: 55,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "12709",
      handle: "@MostlyHarmless@thecanadian.social",
      name: "MostlyHarmless",
      url: "https://thecanadian.social/@MostlyHarmless",
      avatarUrl: "https://s3.us-west-000.backblazeb2.com/TheCanadian/accounts/avatars/109/570/068/793/989/128/original/4eb762e6ef4c6899.jpg",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://mstdn.social/users/ElleGray/statuses/113615237168430072",
    type: 0,
    content: "<p>my favorite part of every Christmas special is when Santa and all the reindeer lift off from a roof and immediately head for the distant horizon instead of the house next door</p>",
    url: "https://mstdn.social/@ElleGray/113615237168430072",
    publishedAt: "2024-12-08T04:08:58.000Z",
    likeCount: 0,
    replyCount: 9,
    repostCount: 28,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "3261",
      handle: "@ElleGray@mstdn.social",
      name: "elle",
      url: "https://mstdn.social/@ElleGray",
      avatarUrl: "https://media.mstdn.social/accounts/avatars/109/609/629/657/793/205/original/6b1fce52053eab2a.jpg",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://mastodon.social/users/ethanschoonover/statuses/115721222356776050",
    type: 0,
    content: "<p>good thing i kept all these for when time travel is invented and i have to go back to the 2000s on some mission</p>",
    url: "https://mastodon.social/@ethanschoonover/115721222356776050",
    publishedAt: "2025-12-15T02:28:42.000Z",
    likeCount: 45,
    replyCount: 3,
    repostCount: 8,
    likedByMe: true,
    repostedByMe: false,
    author: {
      id: "37319",
      handle: "@ethanschoonover@mastodon.social",
      name: "Ethan J. A. Schoonover",
      url: "https://mastodon.social/@ethanschoonover",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/038/463/original/1a065a4d5a92a2e6.jpg",
    },
  },
  {
    id: "https://beige.party/users/maxleibman/statuses/115718947509236648",
    type: 0,
    content: "<p>Small watercolor painting by my wife.</p>",
    url: "https://beige.party/@maxleibman/115718947509236648",
    publishedAt: "2025-12-14T16:50:10.000Z",
    likeCount: 1,
    replyCount: 14,
    repostCount: 21,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "17843",
      handle: "@maxleibman@beige.party",
      name: "Max Leibman",
      url: "https://beige.party/@maxleibman",
      avatarUrl: "https://media.beige.party/accounts/avatars/113/037/436/959/096/130/original/86645ffa4fbbdb49.png",
    },
    repostedBy: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://wandering.shop/users/silvermoon82/statuses/115719385118133380",
    type: 0,
    content: "<p>George Clooney is an actor.</p><p>Put him in the role of a surgeon in front of a camera, and he will do and say things the average non-surgeon viewer will agree are surgeonish. After an hour of that, we are, as average non-surgeon viewers, satisfied and entertained. </p><p>Put him in an operating theatre, and the patient will fucking die because he's not a surgeon and knows nothing about really doing surgery. </p><p>This is a post about LLMs.</p>",
    url: "https://wandering.shop/@silvermoon82/115719385118133380",
    publishedAt: "2025-12-14T18:41:27.000Z",
    likeCount: 3,
    replyCount: 19,
    repostCount: 256,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "2484",
      handle: "@silvermoon82@wandering.shop",
      name: "Mx. Eddie R",
      url: "https://wandering.shop/@silvermoon82",
      avatarUrl: "https://stockroom.wandering.shop/accounts/avatars/113/198/399/489/750/018/original/9e51d0fdbcb11a79.jpg",
    },
    repostedBy: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://cloudisland.nz/users/parisba/statuses/115710491106723110",
    type: 0,
    content: "<p>posted about my Apple ID woes, please share widely?</p><p>https://hey.paris/posts/appleid/</p>",
    url: "https://cloudisland.nz/@parisba/115710491106723110",
    publishedAt: "2025-12-13T04:59:36.000Z",
    likeCount: 715,
    replyCount: 41,
    repostCount: 1641,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "24040",
      handle: "@parisba@cloudisland.nz",
      name: "Dr Paris (he/him)",
      url: "https://cloudisland.nz/@parisba",
      avatarUrl: "https://files.cloudisland.nz/accounts/avatars/000/020/039/original/7d35f13e95ada2e6.jpeg",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://wetdry.world/ap/users/115622499290366672/statuses/115717177049533886",
    type: 0,
    content: "<p>they are best friends<br />#plushtodon</p>",
    url: "https://wetdry.world/@speculaas/115717177049533886",
    publishedAt: "2025-12-14T09:19:55.000Z",
    likeCount: 103,
    replyCount: 0,
    repostCount: 34,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "583669",
      handle: "@speculaas@wetdry.world",
      name: "openbaar vervoer",
      url: "https://wetdry.world/@speculaas",
      avatarUrl: "https://media.wetdry.world/accounts/avatars/115/622/499/290/366/672/original/5c4bc9a165ef6fbd.jpg",
    },
    repostedBy: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://mstdn.social/users/ElleGray/statuses/115714221174646618",
    type: 0,
    content: "<p>Doing some positive affirmations on myself</p>",
    url: "https://mstdn.social/@ElleGray/115714221174646618",
    publishedAt: "2025-12-13T20:48:12.000Z",
    likeCount: 448,
    replyCount: 11,
    repostCount: 239,
    likedByMe: true,
    repostedByMe: true,
    author: {
      id: "3261",
      handle: "@ElleGray@mstdn.social",
      name: "elle",
      url: "https://mstdn.social/@ElleGray",
      avatarUrl: "https://media.mstdn.social/accounts/avatars/109/609/629/657/793/205/original/6b1fce52053eab2a.jpg",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://cosocial.ca/users/evan/statuses/115721303364465958",
    type: 0,
    content: "<p>Thinking tonight about local social networks like Hyves, Skyblog, and Mixi.</p>",
    url: "https://cosocial.ca/@evan/115721303364465958",
    publishedAt: "2025-12-15T02:49:18.000Z",
    likeCount: 2,
    replyCount: 1,
    repostCount: 1,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://mastodon.social/users/ethanschoonover/statuses/115720041026133401",
    type: 0,
    content: "<p>For decades I've been regularly ordering shirts from the same UK shirtmaker that I used to visit when in London but just realized that the US tariffs just blew up the cost on that :/</p>",
    url: "https://mastodon.social/@ethanschoonover/115720041026133401",
    publishedAt: "2025-12-14T21:28:16.000Z",
    likeCount: 2,
    replyCount: 0,
    repostCount: 0,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "37319",
      handle: "@ethanschoonover@mastodon.social",
      name: "Ethan J. A. Schoonover",
      url: "https://mastodon.social/@ethanschoonover",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/038/463/original/1a065a4d5a92a2e6.jpg",
    },
  },
  {
    id: "https://cosocial.ca/users/evan/statuses/115719768125886243",
    type: 0,
    content: "<p>@clipart thank you for the work you do. 🙏🏼</p>",
    url: "https://cosocial.ca/@evan/115719768125886243",
    publishedAt: "2025-12-14T20:18:52.000Z",
    likeCount: 0,
    replyCount: 0,
    repostCount: 0,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://front-end.social/users/sarajw/statuses/115719440721409723",
    type: 0,
    content: "<p>Yes yes yes:</p><p>\"What if the web, and most websites besides the few obvious exceptions, were instead more like book publishing? A few thousand dedicated readers out there, at best.\"</p><p>I'd argue it already is and always has been :)</p><p>\"And perhaps we should let our websites be small and private things once again.\"</p>",
    url: "https://front-end.social/@sarajw/115719440721409723",
    publishedAt: "2025-12-14T18:55:36.000Z",
    likeCount: 10,
    replyCount: 1,
    repostCount: 2,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "11300",
      handle: "@sarajw@front-end.social",
      name: "Sara Joy :happy_pepper:",
      url: "https://front-end.social/@sarajw",
      avatarUrl: "https://cdn.masto.host/frontendsocial/accounts/avatars/109/295/906/487/756/020/original/4d848189db38cb45.jpg",
    },
    repostedBy: {
      id: "790",
      handle: "@ricmac@mastodon.social",
      name: "Richard MacManus",
      url: "https://mastodon.social/@ricmac",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/154/660/original/42a6dc5f0879baed.png",
    },
  },
  {
    id: "https://mastodon.social/users/reiver/statuses/115719081162056630",
    type: 0,
    content: "<p>1/</p><p>The Web of the 1990s and early 2000s (then called the World-Wide-Web) was different (in quality) from the Web of today.</p><p>One interesting thing from that era was that — there were many individuals who (on their own) create whole web-sites about some (narrow) topic each of them obsessed over. Something that each of them raged to master and document — and then published to the world (via the World-Wide-Web).</p><p>...</p><p>#smallNet #smallWeb #smolNet #smolWeb #WorldWideWeb</p>",
    url: "https://mastodon.social/@reiver/115719081162056630",
    publishedAt: "2025-12-14T17:24:09.000Z",
    likeCount: 9,
    replyCount: 1,
    repostCount: 3,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "1764",
      handle: "@reiver@mastodon.social",
      name: "@reiver ⊼ (Charles) :batman:",
      url: "https://mastodon.social/@reiver",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/108/116/990/725/247/731/original/2e097b7812894201.png",
    },
    repostedBy: {
      id: "790",
      handle: "@ricmac@mastodon.social",
      name: "Richard MacManus",
      url: "https://mastodon.social/@ricmac",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/154/660/original/42a6dc5f0879baed.png",
    },
  },
  {
    id: "https://mastodon.social/users/eff/statuses/115719214346879520",
    type: 0,
    content: "<p>Bad patents hurt innovators, small companies, and the public. That's why thousands pushed back against the USPTO's proposal to make patent review nearly impossible. https://www.eff.org/deeplinks/2025/12/thousands-tell-patent-office-dont-hide-bad-patents-review</p>",
    url: "https://mastodon.social/@eff/115719214346879520",
    publishedAt: "2025-12-14T17:58:02.000Z",
    likeCount: 20,
    replyCount: 0,
    repostCount: 19,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "1755",
      handle: "@eff@mastodon.social",
      name: "Electronic Frontier Foundation",
      url: "https://mastodon.social/@eff",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/041/055/original/5882409472032e01.png",
    },
    repostedBy: {
      id: "528",
      handle: "@evan@cosocial.ca",
      name: "Evan Prodromou",
      url: "https://cosocial.ca/@evan",
      avatarUrl: "https://media.cosocial.ca/accounts/avatars/109/493/705/899/503/027/original/298b8e2c6579e0ac.jpg",
    },
  },
  {
    id: "https://ieji.de/users/dboehmer/statuses/115718874293893722",
    type: 0,
    content: "<p>Today I met @kreativ_ohne_druck at the Christmas market at #FeinkostGenossenschaft in #Leipzig. Colorful prints, beautiful #handcraft and some special Japanese technique made of knots.</p><p>The booth was easy to identify by looking for the #plushtodon 😊</p><p>#connewitz #Karli</p>",
    url: "https://ieji.de/@dboehmer/115718874293893722",
    publishedAt: "2025-12-14T16:31:33.000Z",
    likeCount: 44,
    replyCount: 1,
    repostCount: 10,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "3960",
      handle: "@dboehmer@ieji.de",
      name: "Daniel Böhmer",
      url: "https://ieji.de/@dboehmer",
      avatarUrl: "https://ftp.ieji.de/accounts/avatars/000/003/960/original/avatar.jpg",
    },
    repostedBy: {
      id: "91",
      handle: "@Gargron@mastodon.social",
      name: "Eugen Rochko",
      url: "https://mastodon.social/@Gargron",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/000/000/001/original/a0a49d80c3de5f75.png",
    },
  },
  {
    id: "https://wandering.shop/users/silvermoon82/statuses/115719385118133380-2",
    type: 0,
    content: "<p>George Clooney is an actor.</p><p>Put him in the role of a surgeon in front of a camera, and he will do and say things the average non-surgeon viewer will agree are surgeonish. After an hour of that, we are, as average non-surgeon viewers, satisfied and entertained. </p><p>Put him in an operating theatre, and the patient will fucking die because he's not a surgeon and knows nothing about really doing surgery. </p><p>This is a post about LLMs.</p>",
    url: "https://wandering.shop/@silvermoon82/115719385118133380",
    publishedAt: "2025-12-14T18:41:27.000Z",
    likeCount: 3,
    replyCount: 19,
    repostCount: 256,
    likedByMe: false,
    repostedByMe: false,
    author: {
      id: "2484",
      handle: "@silvermoon82@wandering.shop",
      name: "Mx. Eddie R",
      url: "https://wandering.shop/@silvermoon82",
      avatarUrl: "https://stockroom.wandering.shop/accounts/avatars/113/198/399/489/750/018/original/9e51d0fdbcb11a79.jpg",
    },
    repostedBy: {
      id: "100",
      handle: "@_elena@mastodon.social",
      name: "Elena Rossini ⁂",
      url: "https://mastodon.social/@_elena",
      avatarUrl: "https://files.mastodon.social/accounts/avatars/109/246/411/862/197/824/original/1586f1125b5f9786.jpg",
    },
  },
];

// Helper function to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

// Helper to strip HTML tags from content
const stripHtmlTags = (html: string) => {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

interface PostProps {
  post: typeof SAMPLE_POSTS[0];
}

const Post = ({ post }: PostProps) => {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const cleanContent = stripHtmlTags(post.content);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setMenuVisible(true);
    setIsAnimating(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIsAnimating(false));
  };

  const closeMenu = () => {
    setIsAnimating(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMenuVisible(false);
      setIsAnimating(false);
    });
  };

  return (
    <View style={[styles.postContainer, { backgroundColor: colors.background }]}>
      {/* Menu button - absolutely positioned relative to postContainer */}
      <Pressable
        style={styles.menuButton}
        onPress={openMenu}
      >
        <MoreHorizontal size={18} color={colors.textMuted} />
      </Pressable>

      {/* Reposted by indicator */}
      {post.repostedBy && (
        <View style={styles.repostHeader}>
          <RefreshCw size={16} color={colors.textMuted} style={styles.repostIcon} />
          <Text style={[styles.repostText, { color: colors.textMuted }]}>
            {post.repostedBy.name} reposted
          </Text>
        </View>
      )}

      <View style={styles.postContent}>
        {/* Avatar column */}
        <View style={styles.avatarColumn}>
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={styles.avatar}
          />
        </View>

        {/* Content column */}
        <View style={styles.contentColumn}>
          {/* Post header */}
          <View style={styles.postHeader}>
            <View style={styles.authorNameRow}>
              <Text style={[styles.authorName, { color: colors.text }]}>{post.author.name}</Text>
              <Text style={[styles.timestamp, { color: colors.textMuted }]}>
                · {formatRelativeTime(post.publishedAt)}
              </Text>
            </View>
            <Text style={[styles.authorHandle, { color: colors.textMuted }]}>{post.author.handle}</Text>
          </View>

          {/* Custom Menu Modal */}
          <Modal
            visible={menuVisible}
            transparent
            animationType="none"
            onRequestClose={closeMenu}
          >
            <Animated.View
              style={[styles.menuOverlay, { opacity: overlayOpacity }]}
            >
              <Pressable
                style={styles.menuOverlayPressable}
                onPress={closeMenu}
              />
              <Animated.View
                style={[
                  styles.menuDrawer,
                  {
                    backgroundColor: colors.background,
                    borderTopColor: colors.border,
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                {/* Drag handle */}
                <View style={styles.dragHandle} />

                <Pressable
                  style={[styles.menuItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    console.log('Copy link');
                    closeMenu();
                  }}
                >
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Copy link</Text>
                  <Link size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.menuItem, { borderBottomColor: colors.border }]}
                  onPress={() => {
                    console.log('Follow');
                    closeMenu();
                  }}
                >
                  <Text style={[styles.menuItemText, { color: colors.text }]}>Follow</Text>
                  <UserPlus size={22} color={colors.text} />
                </Pressable>
                <Pressable
                  style={[styles.menuItem, { borderBottomWidth: 0 }]}
                  onPress={() => {
                    console.log('Block');
                    closeMenu();
                  }}
                >
                  <Text style={[styles.menuItemText, styles.dangerText]}>Block</Text>
                  <Ban size={22} color="#ff3b30" />
                </Pressable>
              </Animated.View>
            </Animated.View>
          </Modal>

          {/* Post text */}
          <Text style={[styles.postText, { color: colors.text }]}>{cleanContent}</Text>

          {/* Attachments */}
          {post.attachments && post.attachments.length > 0 && (
            <View style={styles.attachmentsContainer}>
              {post.attachments.map((attachment, index) => (
                <Pressable
                  key={index}
                  onPress={() => setLightboxImage(attachment.url)}
                >
                  <View style={styles.attachmentImageContainer}>
                    <Image
                      source={{ uri: attachment.url }}
                      style={styles.attachmentImage}
                      resizeMode="cover"
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Lightbox Modal */}
          <Modal
            visible={lightboxImage !== null}
            transparent
            animationType="fade"
            onRequestClose={() => setLightboxImage(null)}
          >
            <Pressable
              style={styles.lightboxContainer}
              onPress={() => setLightboxImage(null)}
            >
              {lightboxImage && (
                <Image
                  source={{ uri: lightboxImage }}
                  style={styles.lightboxImage}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          </Modal>

          {/* Engagement metrics */}
          <View style={styles.engagementBar}>
            <View style={styles.engagementItem}>
              <Heart
                size={17}
                color={post.likedByMe ? "#ff3b30" : colors.text}
                fill={post.likedByMe ? "#ff3b30" : "none"}
                style={{marginTop: -1.5}}
              />
              <Text style={[styles.engagementCount, { color: post.likedByMe ? "#ff3b30" : colors.text }]}>{post.likeCount}</Text>
            </View>

            <View style={styles.engagementItem}>
              <MessageCircle size={16} color={colors.text} style={{marginTop: -1}} />
              <Text style={[styles.engagementCount, { color: colors.text }]}>{post.replyCount}</Text>
            </View>

            <View style={styles.engagementItem}>
              <RefreshCw
                size={16}
                color={post.repostedByMe ? "#34c759" : colors.text}
                style={{marginTop: -0.5}}
              />
              <Text style={[styles.engagementCount, { color: post.repostedByMe ? "#34c759" : colors.text }]}>{post.repostCount}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Spike2() {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notes</Text>
      </View>

      <FlatList
        data={SAMPLE_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Post post={item} />}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  postContainer: {
    padding: 16,
    position: 'relative',
  },
  repostHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginLeft: -24,
    paddingLeft: 60,
  },
  repostIcon: {
    marginRight: 8,
  },
  repostText: {
    fontSize: 13,
  },
  postContent: {
    flexDirection: "row",
  },
  avatarColumn: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contentColumn: {
    flex: 1,
  },
  postHeader: {
    marginBottom: 0,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    zIndex: 10,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  menuOverlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menuDrawer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    paddingTop: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 17,
  },
  dangerText: {
    color: '#ff3b30',
  },
  authorName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  timestamp: {
    fontSize: 14,
    marginLeft: 4,
  },
  authorHandle: {
    fontSize: 15,
    marginTop: 4,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  attachmentsContainer: {
    marginTop: 4,
    marginBottom: 12,
    gap: 8,
  },
  attachmentImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  attachmentImage: {
    width: "100%",
    height: 300,
  },
  lightboxContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '100%',
    height: '100%',
  },
  engagementBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingTop: 4,
  },
  engagementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  engagementCount: {
    fontSize: 14,
  },
  separator: {
    height: 1,
  },
});
