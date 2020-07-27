# Battleships

Welcome to my battleships game implementation, now ported to a web framework! Game is up and running at https://andrewbarzu.github.io/angular-battleships/

## Difficulty levels

Supported difficulty levels: 

**Easy (Randomly chosen attacks)**: This is the naive approach of playing the game - attacking randomly and hoping you win

**Medium (Seek and destroy algorithm)**: This is a more refined algorithm, that uses the strategy of attacking randomly until a ship is hit, and then attacking everywhere around that point

**Hard (Probability map algorithm)**: This algorithm may not be perfect, in any way, shape or form, because i didn't tweak that much the chosen weights for the ai. I may do more work on it when i figure a way to properly "train" it and make it use better weights for it's probabilities.
The algorithm itself works by looking at the state of the map and trying to fit ships everywhere on it. Places where it can fit ships in more ways, get a higher probability of having a ship inside, and vice versa.

*Let's say at one point the computer is in this scenario:*
![Map Image](https://github.com/AndrewBarzu/angular-battleships/blob/master/docs/assets/myFont/images/TestImage.png)

where white means the computer took a shot and missed, and blue means that there was no shot taken. Then, the computer will try to fit a ship of length 2 on the first line, between the 2 white squares. That will work, so the probability increases. Then, a ship of length 3 isn't possible, neither one of length 4. But it can fit ships vertically, so the probability increases for both squares again, as there could be a ship of length 2, 3 or 4 in those squares.

I tried to fiddle quite some time with the values, but i couldn't get the AI to win in less than 30 moves on average. Hopefully ML and Deep Learning especially can help me in the future with this.
