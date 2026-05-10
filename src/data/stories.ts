import type { Category } from "./sketches";

export type Chapter = {
  n: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
};

export type Arc = {
  id: string;
  category: Category;
  title: string;
  tone: string;
  chapters: [Chapter, Chapter, Chapter, Chapter, Chapter];
};

export const arcs: Arc[] = [
  // ── BIRTHDAY ────────────────────────────────────────────────────────────
  {
    id: "bday-lantern",
    category: "Birthday",
    title: "The Year of the Lantern",
    tone: "warm",
    chapters: [
      { n: 1, title: "A small flame is lit", body: "On the morning of your birthday a single candle stayed lit on the kitchen table, even when nobody was there to watch. It seemed to know it had a job to do, to keep the year ahead from feeling so dark." },
      { n: 2, title: "The lantern goes walking", body: "By afternoon, the candle had wandered into a tiny paper lantern with your name on the side. It bobbed down the hallway, humming a song you used to know." },
      { n: 3, title: "Strangers tip their hats", body: "Out in the lane the lantern met a postman, a baker, and one extremely serious cat. Each of them stopped what they were doing and quietly wished you well, the way good strangers do." },
      { n: 4, title: "The wind tries its best", body: "There was a moment, near dusk, when a great gust came rolling off the hills and the little flame shivered. It did not go out. It only burned a little brighter, like it had remembered who it belonged to." },
      { n: 5, title: "All year by your window", body: "When night came, the lantern hung itself by your window and promised to stay the whole year long. Some birthdays are just a day. This one, very quietly, decided to be twelve months." },
    ],
  },
  {
    id: "bday-parade",
    category: "Birthday",
    title: "A Small Parade",
    tone: "cheer",
    chapters: [
      { n: 1, title: "The first whistle", body: "It started with a single whistle from somewhere down the street. Then a drum. Then a kazoo, played badly but with enormous love. A parade was forming, and it was forming for you." },
      { n: 2, title: "Confetti from nowhere", body: "Confetti began falling out of windows that had no business having confetti. Pink, orange, gold. The wind picked some of it up and wrote your initials in the air, just once, just for a second." },
      { n: 3, title: "The brass band shows up", body: "A brass band turned the corner playing a song that sounded suspiciously like your favorite. The trumpet player winked. The tuba player blew you a kiss. Honestly, the nerve." },
      { n: 4, title: "Everyone is dancing badly", body: "By now the whole street was dancing, and most of them very badly. That, it turned out, was the best part. Nobody had to be good at it. They only had to be there for you." },
      { n: 5, title: "The parade keeps going", body: "When the last drum faded, you noticed something strange: the parade hadn't ended. It had just gotten quieter. It was still walking with you, one block behind, all the way into the new year." },
    ],
  },
  {
    id: "bday-cakemap",
    category: "Birthday",
    title: "The Cake Map",
    tone: "silly",
    chapters: [
      { n: 1, title: "An unusual letter arrives", body: "A letter arrived on your doorstep with no return address and a lot of crumbs. Inside was a map, drawn in frosting, leading from your front door to somewhere marked only with a small pink X." },
      { n: 2, title: "Past the bakery, twice", body: "The map made you walk past the bakery twice, which felt rude, but maps are maps. The baker waved both times. The second time, she pretended not to know why." },
      { n: 3, title: "A trail of small gifts", body: "Along the way you found a ribbon, a candle, a paper crown, and a single perfect strawberry. None of these were on the map. Someone, somewhere, was getting carried away." },
      { n: 4, title: "The X starts singing", body: "When you reached the X, it turned out to be a cake. The cake started singing, which was honestly more than you bargained for. You sang back anyway. It seemed only polite." },
      { n: 5, title: "You take the map home", body: "You ate the cake. You kept the map. You hung it on the fridge so that next year, when the world feels mappy and unmappy at once, you'll remember: there is always frosting if you follow the right line." },
    ],
  },
  {
    id: "bday-older",
    category: "Birthday",
    title: "Older, Better, Brighter",
    tone: "warm",
    chapters: [
      { n: 1, title: "A new ring on the tree", body: "Somewhere inside you, a tree grew a new ring this morning. Quietly. Without ceremony. It is the ring that holds last year's laughter, last year's grief, last year's small and stubborn courage." },
      { n: 2, title: "What the rings remember", body: "If you cut the tree open (please don't), you'd see all the rings holding hands. The wobbly one from the year you moved. The bright one from the year you fell in love. The thick one from the year you survived." },
      { n: 3, title: "The room makes space", body: "The world makes a little extra room for you on a birthday. The chairs scoot in. The cups line up. Even the dog, who is busy with important dog matters, comes to lay her head on your foot." },
      { n: 4, title: "Older sounds like a song", body: "Older isn't a sad word, no matter what anyone tells you. It's a long, slow note in a song you've been writing your whole life. And the song, my friend, is finally getting good." },
      { n: 5, title: "Brighter than last year", body: "You are, by every measurement that matters, brighter than you were last year. The candles know it. We know it. Even the cake, somehow, knows it. Happy, happy, happy birthday." },
    ],
  },

  // ── LOVE ────────────────────────────────────────────────────────────────
  {
    id: "love-pocket-sky",
    category: "Love",
    title: "The Pocket Sky",
    tone: "romantic",
    chapters: [
      { n: 1, title: "I stole a piece of sky", body: "On a Tuesday, for reasons I won't explain, I cut a small square out of the sky and folded it into my pocket. I was saving it. I knew exactly who it was for." },
      { n: 2, title: "It hummed all week", body: "The pocket sky hummed quietly every day. On the bus. In line at the grocery store. Once, in a meeting, so loudly that I had to pretend I was clearing my throat." },
      { n: 3, title: "I tried to give it to you", body: "I tried to give it to you on a Wednesday, but you were laughing at something else and I lost my nerve. The sky understood. It is, after all, very patient." },
      { n: 4, title: "It did not stay folded", body: "The pocket sky refused to stay folded. It kept unfurling at the edges, eager. By Friday it was hanging out of my coat like a clumsy, glowing handkerchief." },
      { n: 5, title: "Yours, since always", body: "So here. Take it. It was always yours. Every cloud. Every star. Every embarrassing little hum on the bus. Yours, since long before I had the courage to say so." },
    ],
  },
  {
    id: "love-mornings",
    category: "Love",
    title: "Where the Mornings Met",
    tone: "romantic",
    chapters: [
      { n: 1, title: "Two kettles, one whistle", body: "Long before we knew each other, your kettle and my kettle were already whistling the same song. Different kitchens. Different cities. The same hopeful little tune." },
      { n: 2, title: "The map of small mornings", body: "There is a map somewhere of every morning we almost met. The day you were one block north. The week I was three minutes too late. The bus we both missed and never knew." },
      { n: 3, title: "The morning it happened", body: "And then, on a perfectly unremarkable Thursday, the morning happened. Coffee. A door. A laugh you weren't expecting to make. The whole map suddenly making sense." },
      { n: 4, title: "Mornings that learned us", body: "The mornings learned us after that. They started arriving with your slippers on and my coffee already poured. They got cleverer. Gentler. Less alone." },
      { n: 5, title: "Every morning since", body: "Every morning since has been a little quieter than the one before, in the best way. Like the world has finally exhaled. Like it always knew where you were going. Like it always knew who you were going to." },
    ],
  },
  {
    id: "love-two-cups",
    category: "Love",
    title: "Two Cups of Tea",
    tone: "warm",
    chapters: [
      { n: 1, title: "One cup waiting", body: "There has been a second cup on the counter for as long as I can remember. Empty, mostly. Hopeful, always. Today, finally, it is full." },
      { n: 2, title: "The kettle approves", body: "The kettle is making the kind of small approving noise it makes when it likes something. It thinks well of you. The kettle, I should mention, is a hard critic." },
      { n: 3, title: "The cookie tin opens", body: "We've reached the part where the cookie tin opens itself, which is a sign you are officially welcome. There is no going back from a cookie tin. I am sorry. Or, actually, I'm not." },
      { n: 4, title: "The afternoon stretches", body: "The afternoon stretches the way afternoons do when you are very, very loved. Slow. Sunlit. The dust dancing in the air like it has all the time in the world." },
      { n: 5, title: "Two cups, every time", body: "From now on the counter will keep setting two cups out. Not because it is asked to. Because that is just how the kitchen has decided things ought to be." },
    ],
  },
  {
    id: "love-letter",
    category: "Love",
    title: "The Long Letter",
    tone: "romantic",
    chapters: [
      { n: 1, title: "I started writing it ages ago", body: "I started this letter ages ago, on a napkin, and I've been adding to it ever since. It has lived in coat pockets and book pages and one suspicious sock drawer." },
      { n: 2, title: "Most of it is the same line", body: "Most of the letter, if I'm honest, is the same line written one hundred different ways. I keep crossing it out and writing it again because no version is quite enough." },
      { n: 3, title: "The middle is just lists", body: "The middle is just lists. Things you said on Tuesdays. Things you do with your hands when you're thinking. The exact sound of your laugh, written down phonetically, badly." },
      { n: 4, title: "There's a P.S. about your hair", body: "There is a P.S. about your hair. There is also a P.P.S. that contradicts the P.S. There is, embarrassingly, a P.P.P.S. as well. The letter is structurally a disaster. I love it anyway." },
      { n: 5, title: "Here, finally", body: "Here. Finally. This is the letter. Please pretend it is more elegant than it is. Please understand that everything I couldn't say is in there somewhere, between the lines, holding your hand." },
    ],
  },

  // ── FRIENDSHIP ──────────────────────────────────────────────────────────
  {
    id: "fr-umbrella",
    category: "Friendship",
    title: "The Shared Umbrella",
    tone: "warm",
    chapters: [
      { n: 1, title: "It started raining", body: "It started raining the way it does in stories, suddenly, and a little theatrically. I had no umbrella. You had a small green one with a duck on it. You did not hesitate." },
      { n: 2, title: "Half wet, half wet", body: "We walked under it together, both of us half wet, both of us laughing about it. That was the deal, apparently. Half-wetness, fairly distributed. I thought, oh, this is what friendship looks like." },
      { n: 3, title: "The duck gives advice", body: "The duck on the umbrella, who I had thought was decorative, turned out to give surprisingly good advice on the subject of my week. You agreed with most of it. The duck, frankly, was right." },
      { n: 4, title: "We took the long way", body: "We took the long way home on purpose. The umbrella didn't mind. The rain didn't mind. Even my shoes, which were doomed, didn't mind. They were having a moment." },
      { n: 5, title: "Bring your half next time", body: "When we said goodnight you handed me half of the umbrella, metaphorically. I am still carrying it. I'll bring it to you next time it rains, yours or mine, doesn't matter. We share weather now." },
    ],
  },
  {
    id: "fr-postcards",
    category: "Friendship",
    title: "Postcards from the In-Between",
    tone: "warm",
    chapters: [
      { n: 1, title: "Distance shows up", body: "The distance arrived all at once, like a delivery nobody signed for. One morning we lived nearby. The next morning we lived in time zones. It was, frankly, rude." },
      { n: 2, title: "First postcard", body: "The first postcard was a coffee shop you'd never been to, with a stain shaped suspiciously like a heart. I sent it because I missed you. I send you stains now. We've evolved." },
      { n: 3, title: "Voice notes at midnight", body: "We started leaving voice notes at midnight, which felt scandalous and necessary. Nothing important. Just the dog. Just the sky. Just the fact that something funny had happened and you were, of course, the only person to tell." },
      { n: 4, title: "We folded the map", body: "Somewhere along the way we got tired of the map. We just folded it. The cities are still where they are, of course. But the friendship stopped caring about cities a long time ago." },
      { n: 5, title: "Same bench, eventually", body: "We will sit on the same bench again eventually. Until then, the in-between is full of postcards and stains and midnight voice notes, and honestly, it is not, not even slightly, not enough." },
    ],
  },
  {
    id: "fr-bench",
    category: "Friendship",
    title: "The Bench at the End of the Road",
    tone: "warm",
    chapters: [
      { n: 1, title: "We've been here a while", body: "There is a bench at the end of the road that has known us for a long time. Longer than the lamppost. Longer than the cracked bit of pavement we always trip on. Possibly longer than us." },
      { n: 2, title: "All the chapters of our laughing", body: "The bench has heard every one of our laughs, in chronological order. The squeaky early ones. The middle ones, which were honestly a little cruel. The current ones, which are kinder." },
      { n: 3, title: "What we've cried about", body: "The bench has also held the crying. The job that fell through. The breakup. The day everything was almost too much. It does not, to its credit, ever bring it up." },
      { n: 4, title: "Future selves visit", body: "Sometimes I think our future selves come and sit on the bench when we're not there. Older us. Quieter us. Still, somehow, talking to each other. Still, somehow, friends." },
      { n: 5, title: "Save me a spot", body: "If you get there before I do, save me a spot. If I get there before you, I will be looking at the sky and pretending I didn't see you coming, just to enjoy the moment of you arriving. Same as ever. Forever, ideally." },
    ],
  },
  {
    id: "fr-brave",
    category: "Friendship",
    title: "We Were Always the Brave Ones",
    tone: "cheer",
    chapters: [
      { n: 1, title: "Two small things, big dreams", body: "When we were small we made a list of brave things we were going to do. The list got lost almost immediately, which was, frankly, the bravest thing about it." },
      { n: 2, title: "The first brave thing", body: "We did the first brave thing without telling anyone. It was tiny. It was terrifying. We held hands all the way home and pretended we were not, somehow, completely changed." },
      { n: 3, title: "The middle brave thing", body: "The middle brave thing nearly broke us. We nearly broke each other. We didn't. We didn't, and that turned out to be the bravest thing of all. The list, by then, had grown back." },
      { n: 4, title: "Other people noticed", body: "Other people started noticing how we were. They asked us where we got it from. We said we got it from each other, which was true, and which made us laugh, because how do you give someone something you only had because of them?" },
      { n: 5, title: "Whatever's next, we're in", body: "Whatever's next on the list (and there is always something next), we're in. Same team. Same hands. Same suspicious bravery, dressed up as ordinary days." },
    ],
  },

  // ── PUNS ────────────────────────────────────────────────────────────────
  {
    id: "pun-donut",
    category: "Puns",
    title: "The Donut Detective",
    tone: "silly",
    chapters: [
      { n: 1, title: "A glaze-related crime", body: "There had been a glaze-related crime. The clues were sticky. The witnesses were powdered. Detective Donut Worry was on the case, and frankly, he was the only one with the doughnut to do it." },
      { n: 2, title: "Interrogating the strawberry", body: "The strawberry was berry suspicious. Detective Donut Worry asked her one question: where were you on the night of the sprinkles? She said something jam-packed with lies. He didn't buy it." },
      { n: 3, title: "The bee is involved", body: "Of course the bee was involved. The bee is always involved. He buzzed in saying he had bee-n out of town, but his alibi didn't hold up under cross-examination. He started sweating honey, which is unprofessional." },
      { n: 4, title: "Sun-sational confession", body: "It was the sun, in the end, who broke down and confessed. He'd been shining too brightly on the donuts. They'd melted into a perfectly understandable, perfectly delicious crime scene." },
      { n: 5, title: "Case closed, mostly", body: "Detective Donut Worry closed the case. He also ate the case. Some say he is still looking for crumbs. Others say the crumbs were the crime all along. The truth, like all good frosting, has many layers." },
    ],
  },
  {
    id: "pun-bee",
    category: "Puns",
    title: "Adventures of Sir Bee-A-Lot",
    tone: "silly",
    chapters: [
      { n: 1, title: "Knighted in pollen", body: "Sir Bee-A-Lot was knighted in pollen on a Tuesday morning. The crown was a little sticky. The honor was real. He flew out into the world to do brave, mildly buzzy things." },
      { n: 2, title: "The flower fellowship", body: "He gathered a fellowship: a daisy, a clover, and one suspiciously chatty rosemary plant. Together they formed the Most Pollinated Round Table. They did not actually have a table." },
      { n: 3, title: "Battle of the rude moth", body: "There was a battle, briefly, with a rude moth who'd been stealing pollen. Sir Bee-A-Lot did not really win it. Nobody really wins battles with moths. They just sort of go away to think about it." },
      { n: 4, title: "Quest for the perfect pun", body: "The true quest, of course, was for the perfect pun. He found it on a flower in a garden that smelled faintly of someone he loved. The pun was: bee mine. Of course it was. Of course it was always going to be." },
      { n: 5, title: "Knighted again, properly", body: "He was knighted again, properly this time, with a small ceremony and an embarrassing amount of nectar. He gives the pun to you now, with all the dignity a small loud insect can muster. Bee mine. Please. He has been practicing." },
    ],
  },
  {
    id: "pun-tea",
    category: "Puns",
    title: "The Tea-Time Plot",
    tone: "silly",
    chapters: [
      { n: 1, title: "A note in the saucer", body: "A note appeared, mysteriously, in the saucer of someone's afternoon tea. It said: you are the best-tea. The handwriting was suspiciously cheerful. The plot was a-brew." },
      { n: 2, title: "The biscuit gives in", body: "The biscuit, who had been a key witness, dunked himself in confession. It was him! He had been writing the notes! He couldn't help it! The tea was just so beautiful! He crumbled, dramatically." },
      { n: 3, title: "An accomplice scone", body: "An accomplice scone arrived. She was buttery, but also bitter. She had her own designs on the tea. There was, briefly, a butter knife situation. Nobody got hurt. Mostly." },
      { n: 4, title: "Confrontation in the kettle", body: "The whole gang met at the kettle for the showdown. Steam rose dramatically. The teaspoon stirred, ominously. And then, quietly, the tea spoke. The tea, it turned out, had a plot of her own." },
      { n: 5, title: "It's you, obviously", body: "The tea wanted you to know: you are, and have always been, the best-tea. Everyone agrees. Including the scone, who is being very gracious about it, considering. Pun delivered. Scene." },
    ],
  },
  {
    id: "pun-sun",
    category: "Puns",
    title: "Cosmic Sun-Tan",
    tone: "silly",
    chapters: [
      { n: 1, title: "A hot-headed star", body: "There once was a star, a small one, who was extremely full of himself. He thought he was sun-sational. Honestly? He kind of was. We don't have to like it." },
      { n: 2, title: "He visits other stars", body: "He went on a tour of other stars to see if any of them were as sun-sational as he was. They were polite about it. They offered tea. They gently changed the subject several times." },
      { n: 3, title: "A planet pushes back", body: "On planet number three, somebody finally pushed back. They told him: listen, you rock, but maybe stop calling yourself sun-sational every five minutes. He took it surprisingly well." },
      { n: 4, title: "The constellation tells the truth", body: "A whole constellation sat him down for a constellation-shaped chat. They told him the secret: the brightest stars don't have to say so. Everyone can just tell. He went a little quieter after that." },
      { n: 5, title: "Now he's annoying about you", body: "Now he tours the galaxy telling everyone how sun-sational you are. He won't shut up about it. The other stars find him exhausting. We, however, are charmed. He's got a point." },
    ],
  },

  // ── CUSTOM ──────────────────────────────────────────────────────────────
  {
    id: "cu-toast",
    category: "Custom",
    title: "A Toast to You",
    tone: "cheer",
    chapters: [
      { n: 1, title: "Glasses up", body: "Tonight we are raising a glass to you. Not a small glass, either. A specific, shiny, slightly ridiculous glass that has been waiting in the cabinet for exactly this occasion." },
      { n: 2, title: "Speech, speech", body: "Someone is calling for a speech. Someone is always calling for a speech. The speech is short, on purpose. It is just one word, and that word is your name." },
      { n: 3, title: "Everyone is clapping", body: "Everyone is clapping. The dog has joined in. The very serious cat across the street has glanced over, which from her counts as a standing ovation." },
      { n: 4, title: "A few quiet words", body: "There will, in a minute, be the part where everything goes quiet for just a second. That's the part where we mean it. The part nobody made a sign for. The part that is purely, only, for you." },
      { n: 5, title: "The whole room knows", body: "The whole room knows. Whatever it is (the milestone, the moment, the brave thing you finally did), the whole room knows. We are so proud of you we have run out of glasses." },
    ],
  },
  {
    id: "cu-thanks",
    category: "Custom",
    title: "The Quietest Thank-You",
    tone: "warm",
    chapters: [
      { n: 1, title: "I keep meaning to say it", body: "I keep meaning to say thank you, and somehow it keeps getting away from me. So here, finally, before it gets away again, thank you. For the thing you know about. And probably also for the things you don't." },
      { n: 2, title: "The list is suspiciously long", body: "I tried to make a list. It got embarrassing. The list is suspiciously long. The list includes \"that one Tuesday\" twice, for two different reasons." },
      { n: 3, title: "Small things, mostly", body: "Most of the thank-yous are for small things. The way you remember. The way you show up. The way you laugh when I am being ridiculous, which is more often than I would like to admit." },
      { n: 4, title: "Big things, secretly", body: "But there are big things hiding in the small ones. There always are. You did a big thing for me. You probably don't even know it. That's why I'm telling you, in a card, where you can't run away." },
      { n: 5, title: "Quietly, gratefully", body: "Quietly, gratefully, completely, thank you. Take this card and put it somewhere annoying, like the fridge, so that every time you reach for milk you have to be reminded, against your will, that someone is grateful for you." },
    ],
  },
  {
    id: "cu-rooting",
    category: "Custom",
    title: "We're Rooting for You",
    tone: "cheer",
    chapters: [
      { n: 1, title: "The whole bleachers", body: "I want you to know that the whole bleachers are full. Every seat. People you know, people you don't, ancestors you've never met, that one tree from your childhood. All of them, here for you." },
      { n: 2, title: "The pep talk", body: "The pep talk is not very polished. The pep talk is mostly just: you've got this, you've got this, you've got this, repeated until somebody believes it. (We already do. Now your job is to.)" },
      { n: 3, title: "Snack-table thoughts", body: "Over at the snack table, we're discussing how hard you have already worked to get here. Honestly, it's a little intimidating. The snack table is impressed. The snack table doesn't impress easily." },
      { n: 4, title: "Whatever happens", body: "Whatever happens, this is true: you tried something brave. That's already the bigger thing. The outcome is just paperwork now. The bravery is the part we are all here for." },
      { n: 5, title: "Bleachers will not leave", body: "And whatever the result is, the bleachers will not leave. We are not weather-dependent. We are not result-dependent. We are you-dependent. You will, in fact, never get rid of us. So go. Go." },
    ],
  },
  {
    id: "cu-sympathy",
    category: "Custom",
    title: "All You Ever Were",
    tone: "warm",
    chapters: [
      { n: 1, title: "I don't have words", body: "I don't have the right words. Almost nobody does, when something is this hard. But I'm here, with all of my wrong words, and I'm here as long as you need." },
      { n: 2, title: "It's okay to not be okay", body: "It is okay to not be okay. It is okay to not be okay tomorrow either. It is okay to be okay one minute and not okay the next. There is no shape grief has to be." },
      { n: 3, title: "Bring me the small things", body: "Bring me the small things. The walk. The cup of tea. The meal you don't feel like eating but somebody should sit with you for. I can do small. Small is what I'm good for, right now." },
      { n: 4, title: "Memory is gentle here", body: "Memory is gentle here. Anything you want to remember, anything you want to say, anything you want to keep saying, there is room for it. There is no rush. There is no end date." },
      { n: 5, title: "All you ever were is here", body: "All you ever were is here, with you. All you ever loved is held. We are holding you, gently, for as long as it takes, which, however long it takes, is exactly the right amount of time." },
    ],
  },
];

export function arcsForCategory(category: Category): Arc[] {
  return arcs.filter((a) => a.category === category);
}

export function findArc(id: string): Arc | undefined {
  return arcs.find((a) => a.id === id);
}
