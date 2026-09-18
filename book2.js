// Book 2: story content and deterministic routing, shared by the reader and tests.
export const loveKeys = ['jihyo', 'chan', 'josh'];
export const loveNames = { jihyo: 'Jihyo', chan: 'Bang Chan', josh: 'Joshua' };
export const rankLove = stats => [...loveKeys].sort((a, b) => (stats[b] || 0) - (stats[a] || 0));
const choice = (label, next, stats = {}, result = '', key) => [label, next, stats, result, key];
const scene = (chapter, place, who, transition, context, text, choices, extra = {}) => ({ chapter, place, who, transition, context, text, choices, ...extra });
const nodes = {
 f0: scene('EPISODE 1 · LIKE OLD TIMES', 'GANGNEUNG BEACH HOUSE · FRIDAY, 3:20 PM', 'Jihyo',
  'The taxi disappears around the bend, leaving you with salt on your lips and a suitcase wheel lodged between two paving stones.',
  'Jihyo reaches you before you can knock. Her arms close around you, warm and familiar, and you bury a smile against her shoulder. “You’re actually here,” she says, squeezing harder. “All four of us. No rescheduling, no emergency meetings. A whole beach-house weekend, just like old times.”\n\nThen she looks down. Everyone looks down. Your suitcase appears to have packed a second suitcase. Jihyo claims one handle—“Best-friend privileges”—just as Chan jogs over with an eager smile, his sleeves pushed up over strong forearms. He reaches for both bags as though they weigh nothing. Joshua leans against the doorway and asks whether you packed bricks again, exactly like he did when you were seventeen.\n\nThree offers. Three familiar faces. An unfamiliar flutter beneath your ribs.',
  'Ignore them. I hugged you first; that clearly makes me head of luggage operations.', [
   choice('Let Jihyo help—independent women can still help each other.', 'arrive_jihyo', {jihyo:3}, 'Take one handle and let her take the other.'),
   choice('Let Chan carry it upstairs.', 'arrive_chan', {chan:3}, 'He looks far too pleased to be useful.'),
   choice('Make Joshua prove the suitcase is actually heavy.', 'arrive_josh', {josh:3}, 'Call his bluff—and follow him upstairs.')]),
 arrive_jihyo: scene('EPISODE 1 · CLOSE ENOUGH', 'BEACH HOUSE STAIRCASE · 3:28 PM', 'Jihyo', 'You and Jihyo haul the suitcase upstairs, stopping halfway to laugh at your terrible coordination.',
  'Sunlight spills across the landing. Jihyo steadies the case with her knee, still holding your hand around the handle. Up close, you notice the tiny crease beside her smile—the same one you used to see across classroom desks.\n\n“I missed this,” she says, quieter now. “Not the luggage. You. Being close enough to tell you something without checking what time zone you’re in.” Her thumb brushes yours. For once, neither of you fills the silence.',
  'Tell me we’re not going to wait this long again.', [
   choice('Look into her eyes and let your smile answer.', 'f1', {jihyo:2}, 'She goes quiet, then smiles as though you have told her a secret.'),
   choice('“I missed you too.” Keep dragging the suitcase upstairs.', 'f1', {jihyo:1}, 'Your shoulders bump all the way to the room.'),
   choice('“Next reunion, you’re helping me pack.”', 'f1', {jihyo:1}, 'She promises strict supervision and absolutely no sensible shoes.')]),
 arrive_chan: scene('EPISODE 1 · A VERY GOOD OFFER', 'YOUR BEACH-HOUSE ROOM · 3:28 PM', 'Bang Chan', 'Chan takes both bags before you can protest. When you reach for the smaller one, he lifts it out of range.',
  'You follow him upstairs with nothing to do except notice the movement of his shoulders beneath his T-shirt. At your doorway, he catches you looking. Of course he does.\n\nHe adjusts his grip, flexing just enough to make the performance obvious. “Door-to-door service. Heavy lifting. Excellent snack recommendations.” He sets the bags down carefully, then turns that bright smile on you. The boy who once stole your fries has become a man who knows exactly what he is doing.',
  'If you don’t already have a man like me, you should. I hear this one’s available.', [
   choice('Roll your eyes at his wink.', 'f1', {chan:1}, 'He laughs. “You used to be much easier to impress.”'),
   choice('Laugh, meet his eyes, and imagine him being your man.', 'f1', {chan:3}, 'Your smile lingers. His does too, suddenly less of a joke.'),
   choice('Wrestle a bag back. “Even dream men can share the workload.”', 'f1', {chan:1}, 'He lets you win the bag—and notices that you called him a dream man.')]),
 arrive_josh: scene('EPISODE 1 · EXCESS BAGGAGE', 'YOUR BEACH-HOUSE ROOM · 3:28 PM', 'Joshua', 'Joshua carries your suitcase upstairs while delivering a deeply unnecessary commentary on its weight.',
  '“Three days,” he says. “Did you bring an outfit for every possible weather system?” You point out that nobody forced him to help. He glances back, smiling. “No. That is the troubling part.”\n\nInside your room, he moves the case out of your path and checks the window latch. “You could have packed half as much,” he adds. His eyes linger on you rather than the luggage. “I suspect you’d still have been distracting.” Before you can decide whether you heard him correctly, the smirk returns.',
  'If there’s another suitcase coming, tell me now. I need time to reconsider how much I like you.', [
   choice('Ignore him and head farther upstairs to explore.', 'f1', {}, 'His laughter follows you. You refuse to give him the satisfaction.'),
   choice('Nudge him. “Keep talking and I’ll zip you inside it.”', 'f1', {josh:2}, '“Taking me home already?” He catches your eye. “Ambitious.”'),
   choice('“Admit it. You volunteered because you missed me.”', 'f1', {josh:3}, 'For one lovely second, he cannot find a teasing answer.')]),
 f1: scene('EPISODE 2 · TOO MANY COOKS', 'BEACH HOUSE KITCHEN · 5:35 PM', 'You', 'By the time everyone has unpacked, the sofa has become a graveyard of exhausted travelers.',
  'The sea breeze pushes at the kitchen curtains. Somewhere behind you, Chan announces that he could eat an entire loaf of bread. You promised homemade pasta—the price of being the group’s resident cook—and now three expectant faces turn toward you.\n\nYou tie on an apron and survey the flour, tomatoes, and basil on the counter. You need two helpers. The other person can set the deck table, choose the music, and remain safely out of splashing distance.',
  'Choose the two people you want with you in the kitchen.', [
   choice('Cook with Jihyo and Chan.', 'kitchen_tasks', {jihyo:2,chan:2}, 'Jihyo washes the basil; Chan chops tomatoes.', ['jihyo','chan']),
   choice('Cook with Jihyo and Joshua.', 'kitchen_tasks', {jihyo:2,josh:2}, 'Jihyo washes the basil; Joshua chops tomatoes.', ['jihyo','josh']),
   choice('Cook with Chan and Joshua.', 'kitchen_tasks', {chan:2,josh:2}, 'Chan chops tomatoes; Joshua washes the basil.', ['chan','josh'])], {setKitchenPair:true}),
 kitchen_tasks: scene('EPISODE 2 · YOUR KITCHEN, YOUR RULES', 'BEACH HOUSE KITCHEN · 5:42 PM', 'You', 'You clap your hands and put your chosen assistants to work.', '',
  'Aprons on. Nobody gets to flirt their way out of washing up.', [choice('Roll up your sleeves and start the pasta.', 'f2', {}, 'The kitchen fills with music, conversation, and the promise of dinner.')], {type:'interlude'}),
 f2: scene('EPISODE 2 · JUST OUT OF REACH', 'BEACH HOUSE KITCHEN · 6:02 PM', 'You', 'The tomato sauce is simmering. It is time to mix the fresh pasta dough.',
  'You crack eggs into a bowl, then reach for the flour on the highest shelf. Your fingertips miss the bag by an infuriating inch. Behind you, a knife pauses against the chopping board. You could find a chair. You could also admit that there are certain advantages to having company.\n\nYou look over your shoulder at your two assistants.',
  'A little help? Whoever designed these cupboards clearly never had to cook in them.', [
   choice('Ask Jihyo to reach it with you.', 'reach_jihyo', {jihyo:2}, 'She comes close enough for you to catch her familiar perfume.', 'jihyo'),
   choice('Call Chan over. “Time to earn your dinner.”', 'reach_chan', {chan:2}, 'He dries his hands and steps behind you, smiling.', 'chan'),
   choice('Ask Joshua. “One tall-person task. No commentary.”', 'reach_josh', {josh:2}, 'He promises nothing about the commentary.', 'josh')], {kitchenOnly:true}),
 flour_fight: scene('EPISODE 2 · DECLARATION OF WAR', 'BEACH HOUSE KITCHEN · 6:08 PM', 'You', 'A pinch of flour becomes a challenge. A second becomes a declaration of war.',
  'You flick a little flour back. Someone laughs; someone protests that these are clean clothes. In seconds, both your helpers are dusted white, and you have abandoned every claim to responsible leadership.\n\nThe sauce bubbles safely on low heat. The garlic bread timer ticks. You pick up the flour bag, and both of them take one cautious step away.',
  'Last chance to surrender.', [
   choice('Corner Jihyo with the flour bag.', 'flour_jihyo', {jihyo:4}, 'Her smile says she has no intention of surrendering.', 'jihyo'),
   choice('Chase Chan around the kitchen island.', 'flour_chan', {chan:4}, 'He laughs and lets you get dangerously close.', 'chan'),
   choice('Smear flour across Joshua’s perfect shirt.', 'flour_josh', {josh:4}, 'He looks down at the handprint. Then he looks at you.', 'josh')], {kitchenOnly:true}),
 flour_jihyo: scene('EPISODE 2 · TOO CLOSE', 'BEACH HOUSE KITCHEN · 6:11 PM', 'Jihyo', 'You corner Jihyo by the counter. She turns the tables before you can celebrate.',
  'She catches your wrists, keeping the flour bag safely between you. Laughter slips out of the room—or perhaps you simply stop hearing it. Her thumb wipes a white streak from your cheek. Her eyes drop to your mouth.\n\nYou have stood this close a thousand times. You cannot remember it ever feeling like this. The oven timer rings, startling you both into a breathless laugh.',
  'We’re not teenagers anymore. I’m starting to notice.', [choice('Finish dinner before either of you says too much.', 'dinner', {jihyo:1}, 'She releases your wrists slowly. The warmth stays.')]),
 flour_chan: scene('EPISODE 2 · CAUGHT', 'BEACH HOUSE KITCHEN · 6:11 PM', 'Bang Chan', 'Chan doubles back around the island, catching you gently at the waist before you collide.',
  'Your laughter breaks against his chest. His arms steady you; once you have your balance, he stays only because you do. He brushes flour from your nose with the back of one finger, his smile softening.\n\n“I used to think looking after you was just habit,” he says. The kitchen suddenly feels much quieter. “I’m beginning to think I gave it the wrong name.” Behind him, the garlic bread timer begins to beep.',
  'Tell me when to let go. I’m being suspiciously bad at remembering.', [choice('Slip free before dinner burns.', 'dinner', {chan:1}, 'His hand trails reluctantly from your waist.')]),
 flour_josh: scene('EPISODE 2 · NO CLEVER ANSWER', 'BEACH HOUSE KITCHEN · 6:11 PM', 'Joshua', 'Joshua studies the flour on his shirt, then catches your hands before you can leave another print.',
  'He holds them lightly against the counter, giving you every opportunity to pull away. You do not. His familiar smirk falters at that discovery.\n\n“Do you actually want me to let go?” he asks. There is no joke tucked behind the question. You are still deciding how brave you feel when footsteps sound on the deck and someone calls that the table is ready. Joshua releases you, but his eyes stay on yours.',
  'Saved by dinner. Your timing remains deeply inconvenient.', [choice('Tell him the conversation is not over.', 'dinner', {josh:1}, 'For once, Joshua has no clever reply.')]),
 dinner: scene('EPISODE 2 · SOMETHING HAS CHANGED', 'BEACH HOUSE DECK · 7:15 PM', 'Narrator', 'You restore order, roll and cut the pasta, and carry dinner out beneath the evening sky.',
  'The four of you eat with bare feet tangled beneath the table. Someone steals the last garlic bread. Someone retells an old story incorrectly, and three people object at once. The sauce is good, the sea is turning silver, and now and then you catch a glance that lasts a little too long.\n\nSana’s message lights up the group chat: bonfire party on the beach, music already on. Jihyo stacks the plates and announces that everyone has precisely forty minutes to become presentable.',
  'You came here to get the old group back. You are beginning to wonder what else you might find.', [choice('Head upstairs with Jihyo to get ready.', 'f3', {}, 'Salt air drifts through your open bedroom window.')], {type:'interlude'}),
 f3: scene('EPISODE 3 · GETTING READY', 'YOUR SHARED BEDROOM · 8:10 PM', 'Jihyo', 'Upstairs, Jihyo opens both suitcases and announces that the bonfire party requires an outfit.',
  'She sits cross-legged on your bed, sorting through clothes while you fix your hair. The room smells of her perfume and the sea. You trade compliments, borrow a lip gloss, and pretend neither of you noticed all the looking that happened over dinner.\n\nWhatever tonight becomes, this part remains easy: your best friend beside you, reminding you that you deserve to feel beautiful.',
  'Tonight calls for something that says effortless—even though we both know this took forty minutes.', [
   choice('A silky black dress and boots.', 'f4', {bold:2}, 'Confident, sleek, and guaranteed to cause staring.'),
   choice('A soft sundress with an oversized cardigan.', 'f4', {sweet:2}, 'Romantic, comfortable, and dangerously approachable.'),
   choice('Wide-leg trousers with a daring top.', 'f4', {cool:2}, 'Relaxed until somebody notices the details.')]),
 f4: scene('EPISODE 3 · UNDER THE STRING LIGHTS', 'MOONWAVE BEACH · THE BONFIRE PARTY', 'Sana', 'You follow the sound of music down to the beach.',
  'A bonfire throws gold across the sand. Friends lounge on blankets beneath strings of lights; someone is passing around marshmallows, and the ocean keeps time beneath the music. Sana waves you over, delighted that the whole childhood gang has finally made it.\n\nJihyo is swaying near the speakers. Chan is recruiting players for a ring-toss tournament beside the fire. Joshua sits at the quieter edge with a drink, watching the crowd. For once, nobody has anywhere else to be.',
  'Go on. You have a whole evening to catch up—with everyone.', [
   choice('Find Jihyo near the music.', 'party_jihyo', {}, 'Start with a song and a familiar smile.', 'jihyo'),
   choice('Join Chan’s ring-toss team.', 'party_chan', {}, 'He immediately declares you his lucky charm.', 'chan'),
   choice('People-watch with Joshua.', 'party_josh', {}, 'He makes room beside him before you ask.', 'josh')], {partyHub:true}),
 party_jihyo: scene('EPISODE 3 · YOUR RHYTHM', 'MOONWAVE BEACH · BY THE SPEAKERS', 'Jihyo', 'Jihyo catches your hand when you reach the music.',
  'At first, it is the same ridiculous choreography you invented in her bedroom years ago. Then the song changes. The bass slows; her fingers stay linked with yours.\n\nShe steps closer, giving you time to meet her halfway. Firelight warms her cheek. You can feel the question in the space between your bodies, in the way her gaze flickers to your mouth and returns to your eyes.',
  'You still know all my moves. Want to learn a new one?', [
   choice('Move closer and dance with her hands at your waist.', 'f4', {jihyo:3}, 'You settle into the same slow rhythm. Her forehead nearly touches yours.'),
   choice('Keep it playful—dance separately and make her laugh.', 'f4', {jihyo:1}, 'You trade increasingly terrible moves until she is laughing too hard to keep time.'),
   choice('Spin her dramatically. “We’re charging for the next performance.”', 'f4', {jihyo:2}, 'She spins back into your arms and asks whether payment can be dinner.')], {completeParty:'jihyo'}),
 party_chan: scene('EPISODE 3 · ON YOUR TEAM', 'MOONWAVE BEACH · THE RING-TOSS GAME', 'Bang Chan', 'Chan hands you three rope rings as though he is entrusting you with an Olympic medal.',
  'The targets are wooden pegs outlined by lanterns, and the stakes are a bag of marshmallows. Chan nevertheless approaches the match with heroic seriousness. He cheers your first throw, retrieves your second, and shifts a lantern out of your path before you can trip over it.\n\nWhen another team scores, he leans close to discuss tactics. When you score, he looks at you instead of the peg. You are beginning to suspect that winning is not his only reason for smiling.',
  'One more point and we’re champions. I accept victory hugs, just so you know.', [
   choice('Cheer together and throw your arms around him when you win.', 'f4', {chan:2}, 'He catches you in a warm hug and forgets about collecting the prize.'),
   choice('Ignore the flirting. You have a tournament to win.', 'f4', {chan:1}, 'Your concentration delights him. He appoints himself your very loud fan club.'),
   choice('Promise him a victory hug—if he earns it.', 'f4', {chan:2}, 'He lands the next ring, then opens his arms with an unbearable grin.')], {completeParty:'chan'}),
 party_josh: scene('EPISODE 3 · THE QUIET EDGE', 'MOONWAVE BEACH · A DRIFTWOOD BENCH', 'Joshua', 'Joshua moves his jacket aside, leaving a place for you on the bench.',
  'From here, the party is a moving picture: Jihyo laughing beneath the lights, Chan waving someone toward the game, sparks climbing into the dark. You settle beside Joshua with a drink, your knees nearly touching.\n\nHe supplies dry commentary about a spectacularly unsuccessful attempt to toast six marshmallows at once. You laugh, and he looks pleased in a way he cannot quite disguise. Then the silence becomes comfortable enough to risk something honest.',
  'Best seat here. Though I admit the view improved when you arrived.', [
   choice('Rest your head on his shoulder.', 'f4', {josh:2}, 'He stills, then shifts closer so you can settle comfortably.'),
   choice('Watch him instead. “I like this view.”', 'f4', {josh:3,bold:1}, 'For once, you are the reason he looks away first.'),
   choice('Watch Jihyo smiling beneath the lights.', 'f4', {jihyo:1}, 'Joshua follows your gaze. “She’s happier when you’re here.”'),
   choice('Watch Chan celebrating by the game.', 'f4', {chan:1}, 'Joshua catches your smile. “He’s checked where you are about twelve times.”')], {completeParty:'josh'}),
 walk: scene('EPISODE 4 · ROOM TO THINK', 'MOONWAVE BEACH · 10:45 PM', 'Narrator', 'After spending time with all three friends, you leave the lights for a short walk along the water.',
  'Cool sand gives beneath your feet. Behind you, the party fades to a low, happy murmur. You came expecting familiar stories and borrowed clothes. Instead, you keep replaying a touch, a look, the particular way someone said your name.\n\nYour best friend. Her brother. His best friend. People who know who you used to be—and might be asking to know you differently now. You stop near the drinks stand at the edge of the party, giving your racing thoughts a moment to catch up.',
  'The waves offer no advice. For a minute, that feels like a kindness.', [choice('Take a breath before heading back.', 'f6', {}, 'A stranger approaches before you can turn toward the fire.')], {type:'interlude'}),
 f6: scene('EPISODE 4 · UNINVITED COMPANY', 'BEACH DRINKS STAND · 10:48 PM', 'A stranger', 'A man from the party stops beside you and asks why you are out here alone.',
  'At first, the conversation is harmless. Then he asks where you are staying, shifts closer when you step aside, and ignores your first attempt to leave. The drinks stand is busy enough that you do not feel isolated, but you are tired of being polite.\n\nAcross the sand, your friends look up. Two familiar faces turn toward you almost at once.',
  'Come on—one dance. Unless somebody here is going to be jealous?', [
   choice('Keep it polite while looking for your friends.', 'calls', {trust:1}, 'You can handle yourself. Familiar company would still be welcome.'),
   choice('Tell him clearly that you are not interested.', 'calls', {bold:2}, 'You make your boundary unmistakable.'),
   choice('“My dance card is full. So is my patience.”', 'calls', {bold:1}, 'A little humor makes the refusal no less definite.')]),
 calls: scene('EPISODE 4 · TWO CALLS', 'BEACH DRINKS STAND · 10:52 PM', 'You', 'Your phone vibrates with one call, then a second incoming name.', '',
  'You can answer either call—or put the phone away and leave on your own terms.', [
   ...loveKeys.map(key => choice(`Answer ${loveNames[key]}’s call.`, `call_${key}`, {[key]:2}, 'A familiar voice cuts through the noise.', key)),
   choice('Decline both calls—I can handle this.', 'no_call', {}, 'You put your phone away and turn toward the fire.', 'none')], {topCallers:true}),
 no_call: scene('EPISODE 4 · YOUR OWN RESCUE', 'BEACH DRINKS STAND · 10:54 PM', 'You', 'You decline both calls and slip the phone into your pocket.',
  '“This conversation is over.” You say it plainly, then walk back toward the lights. Your friends meet you halfway. Nobody demands an explanation or makes your decision about them. Someone asks whether you are okay; someone offers you a fresh drink.\n\nYou feel the relief of being cared for without being overruled.',
  'I’m fine. Come on—somebody owes me a marshmallow.', [choice('Rejoin everyone at the bonfire.', 'bonfire', {self:3,trust:1}, 'You return because you want their company.')]),
 bonfire: scene('EPISODE 5 · WHEN THE FIRE BURNS LOW', 'MOONWAVE BEACH · 12:08 AM', 'Narrator', 'All four of you settle around the bonfire again, sharing a blanket and the last of the snacks.',
  'The conversation wanders through terrible school photos, old nicknames, and Chan’s firm belief that his teenage haircut was ahead of its time. You laugh until your cheeks ache. The crowd thins. The fire settles into a red-gold glow.\n\nEventually, two friends volunteer to fetch another round of drinks. Their footsteps fade across the sand. The person who stays beside you draws the blanket a little closer, and you realize the quiet is no accident.',
  'For the first time tonight, you do not reach for a joke to fill the space.', [choice('Stay beside the fire and meet their eyes.', 'confess_jihyo', {}, 'Your strongest connection is ready to tell you the truth.')], {type:'interlude',routeByTopAll:true}),
 confess_jihyo: scene('EPISODE 5 · YOUR PERSON', 'BESIDE THE BONFIRE · 12:31 AM', 'Jihyo', 'Jihyo stays beside you as the others go for drinks. Beneath the blanket, her little finger brushes yours.',
  '“I had a speech,” she admits. “A very good one. You were supposed to be less distracting while I remembered it.” You laugh, and the nervousness in her face softens.\n\nShe turns toward you. “I missed my best friend. That part is easy. But I also missed holding your hand and wondering if you wanted me to keep holding it.” Her fingers open beside yours, an invitation. “This weekend wasn’t a trick to get you here. I wanted all of us back. I just can’t keep pretending that’s all I want.”\n\nThe fire catches in her eyes. You can feel your heartbeat everywhere.',
  'You’re my favorite person. If friendship is what you want, I’ll still be here. But if you want to kiss me, I would really like you to stop making me guess.', [
   choice('Kiss her beside the fire.', 'bend', {love:5}, 'You close the small distance between you.'),
   choice('Hold her and ask to take it slowly.', 'bend', {slow:5}, 'You want this—and enough time to be careful with it.'),
   choice('Tell her you love her only as a friend.', 'bend', {friend:5}, 'Give her an honest answer, gently.')]),
 confess_chan: scene('EPISODE 5 · SOMETHING TO OFFER', 'BESIDE THE BONFIRE · 12:31 AM', 'Bang Chan', 'Chan stays as the others head toward the drinks stand, leaving enough space for you to decide whether to move closer.',
  '“I know I’ve been showing off,” he says. “The bags. The game. The extremely subtle boyfriend advertisement.” His laugh is warm, but his hands are suddenly still. “I can carry luggage for anyone. You’re the person I want beside me after I put it down.”\n\nHe looks directly at you. “I used to find excuses to tag along when you and Jihyo went out. I thought I’d grow out of it. Then you got here today, and I wanted to hear everything I’d missed.” His smile turns shy at the edges. “You don’t need me to take care of you. I know that. I’d still like to be someone you can lean on.”',
  'I want to take you on a date. A real one, where I get to flirt with you and you know I mean every word. Would you like that?', [
   choice('Kiss him beside the fire.', 'bend', {love:5}, 'Give him an answer he cannot mistake for teasing.'),
   choice('Rest against him and take it slowly.', 'bend', {slow:5}, 'Let a familiar closeness become something new at your pace.'),
   choice('“I love you like a brother. Thank you for telling me.”', 'bend', {friend:5}, 'Be kind without promising feelings you do not have.')]),
 confess_josh: scene('EPISODE 5 · WITHOUT THE PUNCHLINE', 'BESIDE THE BONFIRE · 12:31 AM', 'Joshua', 'Joshua watches the others leave, then looks back at you. For once, he seems to be choosing his words carefully.',
  '“I could make a joke,” he says. “It has been an embarrassingly reliable strategy.” You wait. He exhales, smiling at himself. “You arrive with too many bags, threaten to put me in one, and somehow I start wishing the weekend were longer.”\n\nHis knee rests close to yours. “I remember things I have no sensible excuse to remember. The songs you used to skip. How you get quiet when something matters. Every time you visited, and every time I let you leave without saying anything.” He turns his hand palm-up on the blanket.\n\n“I thought keeping it to myself would keep everything simple. It mostly made me an idiot with excellent material.”',
  'I like you. No punchline. If you give me a chance, I’d like to be the person you come here with next time—and the one you leave with.', [
   choice('Pull him in for a kiss.', 'bend', {love:5}, 'For once, neither of you needs the last word.'),
   choice('Take his hand and ask to go slowly.', 'bend', {slow:5}, 'Give him a beginning, without rushing the rest.'),
   choice('“You’re like a brother to me. I want to stay friends.”', 'bend', {friend:5}, 'Let the answer be honest, even when it is difficult.')])
};
const reachCopy = {
 jihyo: ['Jihyo steps behind you, reaching over your shoulder. Her free hand hovers at your waist until you lean back a fraction. You feel her breath catch; yours answers.\n\nShe eases the bag from the shelf. When she passes it to you, her fingers graze yours, and the simplest task in the world becomes absurdly difficult. A puff of flour escapes the folded top onto your apron. Jihyo laughs, brushing a little onto your nose. “There. Now you look professional.”', 'You could let that go. You have never been particularly good at letting her win.'],
 chan: ['Chan steps behind you, one arm reaching easily above your head. His chest brushes your shoulder, warm through the thin fabric of your shirt, and suddenly the cupboard deserves all of your attention.\n\n“Got it,” he says softly. As he hands you the flour, your fingers slide across his. You both pause. The tilted bag lets a little flour fall across his wrist; he grins, then taps a white dot onto your nose. “Chef’s uniform. Very official.”', 'He has made two mistakes: standing within reach, and assuming you will not retaliate.'],
 josh: ['Joshua steps close behind you, bracing one hand on the counter while he reaches overhead. His sleeve brushes your bare arm. “You could say please,” he murmurs, but the teasing is quieter from this distance.\n\nHe lowers the bag into your hands. Your fingers catch against his, and for a beat neither of you lets go. Flour slips from the folded opening onto his shirt. He looks down, then dusts a little onto your cheek with one fingertip. “An accident. Obviously.”', 'His expression is innocent. His timing is terrible. The flour bag is now in your hands.']
};
for (const key of loveKeys) {
 nodes[`reach_${key}`] = scene('EPISODE 2 · A LITTLE CLOSER', 'BEACH HOUSE KITCHEN · 6:05 PM', 'Narrator', `${loveNames[key]} crosses the kitchen to help you.`, reachCopy[key][0], reachCopy[key][1], [choice('Flick a little flour back. “You started it.”', 'flour_fight', {}, 'Your other helper looks up—and immediately gets caught in the crossfire.')], {type:'interlude'});
 const person = loveNames[key];
 nodes[`call_${key}`] = scene('EPISODE 4 · ON THE LINE', 'PHONE CALL · 10:53 PM', person, `You answer ${person}.`,
  key === 'jihyo' ? '“Are you okay?” Jihyo asks. The music is muffled behind her voice. Across the sand, you see her watching you, waiting for your answer instead of making the decision for you.' : key === 'chan' ? 'Chan’s voice is steady, his usual laughter replaced by attention. “Is he bothering you?” Across the sand, he is already on his feet—but he waits for your answer.' : '“Want an exit?” Joshua asks. Every trace of teasing has left his voice. You see him set his drink down, his eyes on you rather than the man beside you.',
  key === 'jihyo' ? 'Say the word and I’m there. Or tell me you’ve got it handled, and I’ll trust you.' : key === 'chan' ? 'Do you want me to step in? You decide. I’m right here.' : 'Give me ten seconds and I can be your very convincing partner. Your call.', [
   choice(key === 'jihyo' ? '“Save me. Please pretend you’re my partner.”' : key === 'chan' ? '“Save me. Pretend you’re my partner.”' : '“Save me. Make it convincing.”', `rescue_${key}`, {[key]:4}, 'They cross the sand without hesitation.'),
   choice('“I’m okay. Meet me at the bonfire.”', 'bonfire', {[key]:1,trust:2}, 'You end the conversation with the stranger and walk back on your own terms.')]);
}
nodes.rescue_jihyo = scene('EPISODE 4 · VERY CONVINCING', 'BEACH DRINKS STAND · 10:54 PM', 'Jihyo', 'Jihyo reaches you with the easy confidence of someone who knows exactly where she wants to be.',
 'Her arm settles around your waist as you lean into her. She kisses your temple. “There you are, love.” Then she turns to the stranger: “I’m her partner. We’re heading back.”\n\nHe apologizes and leaves. Jihyo keeps her arm where it is, glancing at you to check that you want her there. The warmth of her mouth seems to linger against your skin.',
 'Too convincing? I can be less convincing. I would prefer not to be.', [choice('Stay close and lead her to the bonfire.', 'bonfire', {jihyo:3}, 'The pretend relationship feels dangerously natural.')]);
nodes.rescue_chan = scene('EPISODE 4 · RIGHT BESIDE YOU', 'BEACH DRINKS STAND · 10:54 PM', 'Bang Chan', 'Chan reaches you and offers his hand. Only when you take it does he move beside you.',
 '“My partner said she’s not interested.” His voice is low and firm. When the stranger starts to object, Chan holds his gaze. “Step away. If you keep bothering her, we’ll have the staff walk you out.”\n\nThe man leaves. Something about Chan’s certainty sends warmth through you: he listened, you asked, and he showed up without making you explain twice. Then he turns back to you, his expression softening at once.',
 'Was that okay? I know it was pretend. It didn’t feel entirely pretend to me.', [choice('Keep holding his hand on the way to the bonfire.', 'bonfire', {chan:3}, 'His thumb strokes yours as you walk back together.')]);
nodes.rescue_josh = scene('EPISODE 4 · TAKING DIRECTION', 'BEACH DRINKS STAND · 10:54 PM', 'Joshua', 'Joshua arrives looking remarkably calm for someone who crossed the beach in ten seconds.',
 'He takes the cup you offer him, freeing your hand to catch his sleeve. His arm settles around your waist. “There you are. I was starting to think my partner had abandoned me.” The private smile he gives you is almost unfair.\n\nThe stranger mutters an apology and moves away. Joshua leans closer, waiting to see whether you will step out of the embrace. You stay.',
 'You asked me to make it convincing. I take direction very seriously.', [choice('Tell him to stay convincing until the bonfire.', 'bonfire', {josh:3}, 'His arm remains around you all the way back.')]);

export const book2 = {
 title:'The Summer Between Us', revision:2, genre:'Friends-to-Lovers · Beach Reunion',
 hook:'Your best friend. Her brother. His best friend. One reunion weekend—and three familiar hearts you suddenly cannot stop thinking about.',
 tags:['childhood friends','beach reunion','three possible loves'], start:'f0', nodes,
 length:`${Object.keys(nodes).length} scenes · 3 ending types`,
 cast:[['Jihyo','TWICE','Your best friend','Your favorite person, with a brave smile and something she has never quite said.'],['Bang Chan','Stray Kids','Your best friend’s older brother','Warm, playful, protective—and suddenly very aware that you are both grown up.'],['Joshua','SEVENTEEN','Her brother’s best friend','Dry teasing, quiet attention, and feelings hidden behind a very good poker face.'],['Sana','TWICE','Your friend and party host','The cheerful instigator bringing everyone together beneath the beach lights.']],
 setup:{kicker:'FOUR OLD FRIENDS. ONE SUMMER. EVERYTHING LEFT UNSAID.',title:'The Summer Between Us',
 body:'You, Jihyo, her older brother Bang Chan, and his best friend Joshua were inseparable growing up. Then careers, cities, and years got in the way. Now Jihyo has rented a beach house for one reunion weekend—and the familiar group feels different when everybody is older, bolder, and finally willing to admit what they want.',
 roles:[['You','The main character. You grew up with all three friends; this weekend, you decide what those bonds become.'],['Jihyo','Your best friend—and a possible love you never quite knew how to name.'],['Bang Chan','Jihyo’s older brother, once a familiar presence and now a very distracting one.'],['Joshua','Bang Chan’s best friend, whose teasing has always hidden how closely he pays attention.']],
 stakes:'Reconnect with all three friends, follow the sparks, and decide whether an old friendship becomes a kiss, a slow beginning, or a bond you keep exactly as it is.',
 warning:'A fictional friends-to-lovers beach romance. Everyone is an adult.'}
};

export function book2Choices(node, state) {
 return (node.choices || []).map((c,i) => [c,i]).filter(([c]) => {
  if (node.kitchenOnly) return (state.kitchenPair || []).includes(c[4]);
  if (node.partyHub) return !(state.partyVisited || []).includes(c[4]);
  if (node.topCallers) return c[4] === 'none' || rankLove(state.stats).slice(0,2).includes(c[4]);
  return true;
 });
}
// Called after the standard engine has awarded the selected choice's points.
export function advanceBook2(node, selected, state) {
 let next = selected[1];
 if (node.setKitchenPair) state.kitchenPair = [...selected[4]];
 if (node.completeParty) {
  state.partyVisited = [...new Set([...(state.partyVisited || []), node.completeParty])];
  if (state.partyVisited.length === 3) next = 'walk';
 }
 if (node.routeByTopAll) {
  state.finalMan = rankLove(state.stats)[0];
  next = `confess_${state.finalMan}`;
 }
 return next;
}
export function book2Scene(node, state) {
 if (node === nodes.kitchen_tasks) {
  const pair = state.kitchenPair || [], other = loveKeys.find(k => !pair.includes(k));
  const tasks = pair.includes('jihyo') ? `${loveNames[pair[0]]} rinses the basil while ${loveNames[pair[1]]} chops tomatoes.` : 'Bang Chan chops tomatoes while Joshua rinses the basil.';
  return {...node,context:`${tasks} You put the sauce on and explain that fresh pasta rewards patience, a statement neither assistant takes particularly seriously. ${loveNames[other]} carries glasses to the deck and calls back with unsolicited musical suggestions.\n\nNobody is far away. Choosing your kitchen crew has simply changed who gets to stand beside you while you cook.`};
 }
 if (node.partyHub && state.partyVisited?.length) {
  return {...node, transition:'You drift back toward the fire, the last conversation still warming your thoughts.',context:'The party carries on around you: sparks overhead, music across the sand, familiar laughter everywhere. You have time to find the friends you have not spent a quiet moment with yet.',text:state.partyVisited.length === 2 ? 'One more familiar face. One more chance to discover what has changed.' : 'Who will you spend time with next?'};
 }
 if (node.topCallers) {
  const [a,b] = rankLove(state.stats);
  return {...node,context:`${loveNames[a]} is calling. Before you can answer, ${loveNames[b]}’s name appears too. They have been finding reasons to stay near you all evening; now both have noticed the conversation by the drinks stand.\n\nYou glance back toward the fire. They are watching, waiting for your signal.`};
 }
 if (node.routeByTopAll) {
  const [top,...others] = rankLove(state.stats);
  return {...node, context:node.context.replace('two friends volunteer',`${loveNames[others[0]]} and ${loveNames[others[1]]} volunteer`).replace('The person who stays beside you draws',`${loveNames[top]} stays beside you and draws`)};
 }
 return node;
}
const endingCopy = {
 jihyo:{
  love:'You touch her cheek before you kiss her. Jihyo goes still for a heartbeat, then smiles against your mouth and pulls you closer beneath the blanket. “Finally,” she whispers, laughing at herself. In the morning, she takes your hand under the breakfast table. Your best friend is still your best friend. Now you get to fall in love with her, too.',
  slow:'You lean into her and tell her you want to discover this carefully. Jihyo threads her fingers through yours. “I can do slow,” she says. “I may be very annoying about our first date.” By sunrise, you have agreed on coffee, a walk, and no pretending that either of you means it as just friends.',
  friend:'You tell her she is your favorite person, but the feeling is friendship. Jihyo takes a breath and nods. “Thank you for telling me the truth.” You give her room to feel the disappointment without asking her to hide it. At breakfast, she nudges the toast toward you. The friendship is still here, with space for honesty and a little time.'},
 chan:{
  love:'You catch the front of his shirt and kiss him. For once, Chan has absolutely nothing to say. Then his hand settles at your cheek, gentle despite the smile he cannot contain. “So the boyfriend application went well?” At breakfast, he brings your coffee and asks you to dinner—just the two of you, with no luggage required.',
  slow:'You rest your head against his shoulder and admit that you want this, but slowly. Chan kisses the top of your head after you tilt toward him. “Then slowly is perfect.” He offers a real first date when you are back home. You accept, and he looks more delighted than he did winning anything all night.',
  friend:'You tell him that you love him like a brother and thank him for trusting you enough to ask. His smile fades, but he listens. “Okay. I’m glad I told you. I’m glad you told me.” You let the quiet be honest. In the morning, he joins the breakfast argument as usual, a little subdued but still part of the life you share.'},
 josh:{
  love:'You take his hand and pull him toward you. The kiss interrupts whatever clever thing he was about to say; when you draw back, he seems grateful for it. “I should have tried honesty years ago.” At breakfast, his knee finds yours beneath the table. He asks if he can take you home, then quickly clarifies: “With a proper date on the way.”',
  slow:'You slide your hand into his and ask for time to learn this version of each other. Joshua nods without making a joke. “I want the real thing. I can wait for it.” His thumb brushes your knuckles. The next morning, he asks you out plainly, and you discover that his sincerity might be your favorite surprise of the weekend.',
  friend:'You explain that he feels like family—like a brother—and that you want to remain friends. Joshua looks down for a moment. “Not my preferred plot twist,” he says softly, then meets your eyes. “But I’m glad you didn’t give me a different answer to spare me.” You give him space. At breakfast, he passes you a plate, and the first small joke between you lands gently.'}
};
export function book2Ending(state) {
 const key = state.finalMan || rankLove(state.stats)[0];
 const kind = state.stats.love ? 'love' : state.stats.slow ? 'slow' : 'friend';
 return {title:{love:'More Than Old Friends',slow:'The Slow-Burn Beginning',friend:'The Friendship You Chose'}[kind],sub:endingCopy[key][kind],endingMan:kind === 'friend' ? null : loveNames[key]};
}
