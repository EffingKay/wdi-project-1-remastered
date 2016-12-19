const Game = Game || {};

Game.score               = 0;
Game.currentWords        = [];
Game.easyScore           = 0;
Game.normalScore         = 0;
Game.extremeScore        = 0;

// game over screen
Game.gameOverScreen = () => {
  const highScore = this.parseHighScore(this.level);
  const toAppend = `<div class="landingScreen">
  <h1>TYPING GAME</h1>
  <h2>Your final score is: ${this.score} <br>
  Highscore: ${highScore} <br>
  Wanna play again?</h2>
  <button type="button" id="easy">Easy</button>
  <button type="button" id="normal">Normal</button>
  <button type="button" id="extreme">Extreme</button>
  </div> `;
  $('main').append(toAppend).fadeIn();
  $('.game').fadeOut();
  this.init();
},

// game over
Game.gameOver = () => {
  $('.board').children().stop().remove();
  $('.game').remove();
  this.gameOverScreen();
},

// checks if the word submitted matched any word in a currentWords array
Game.doesMatch = (e) => {
  e.preventDefault();
  const typed = $('input').val();
  this.currentWords.indexOf(typed) > -1 ? this.matchFound() : this.matchNotFound();
};

Game.matchFound = () => {
  const typed              = $('input').val();
  const boardChildrenArray = $('.board').children();
  const index              = this.currentWords.indexOf(typed);
  this.currentWords.splice(index, 1);
  $(boardChildrenArray).each((i, elem) => {
    if ($(elem).text() === typed) {
      $(elem).text('').finish().css('marginLeft', '0px');
    }
  });
  $('input').val('');
  this.doesMatch;
  Game.score++;
  $('#score').html(`Score: ${this.score}`);
  this.changeBackground();
},

Game.matchNotFound = () => {
  $('input').val('').effect('highlight');
},

Game.changeBackground = () => {
  const randomColors = ['#FF1962', '#8EE0F2', '#F5BB00', '#18A346', '#2EC4B6', '#8EA604', '#B84256', '#68EDCC', '#F16146', '#F25959', '#0EAD69', '#FF4E00','#FF3338', '#00ACAE', '#FFFF5D', '#0090C9', '#EC9F05', '#EE4266'];
  const randomNumber = Math.floor(Math.random() * (randomColors.length-1)) + 1;
  $('body').css('backgroundColor', randomColors[randomNumber]);
},

// generates a word every x seconds

// animate the word across the board
Game.animateWord = (word) => {
  const $windowWidth = $(window).width() + 'px';
  $(word).animate({
    marginLeft: $windowWidth
  }, this.animationDuration, () => {
    if ($(word).text() !== '') {
      Game.gameOver();
    }
  });
},

// parse a word in the board div and push it to currentWords array
Game.parseWord = (word) => {
  const randomNumber       = (Math.floor(Math.random() * 19) + 1);
  const boardChildrenArray = $('.board').children();
  if ($(boardChildrenArray[randomNumber]).html() === '') {
    boardChildrenArray[randomNumber].append(word);
    this.currentWords.push(word);
    this.animateWord(boardChildrenArray[randomNumber]);
  }
},

// generates a random word and parse it to the board
Game.randomWord = () => {
  const randomNumber = (Math.floor(Math.random() * (window.words.length - 1)) + 1);
  this.parseWord(window.words[randomNumber]);
},

// creates a board which will be populated with random words , plus removes eerything from last shown screen
Game.parseBoard = function () {
  this.currentWords = [];
  this.score        = 0;
  $('.landingScreen').remove();
  $('main').append(this.board.toParse());
  this.board.wordDiv();
  $('form').on('submit', this.doesMatch);
  $('input').focus();
  setInterval(Game.randomWord, Game.interval);
};

// determine high score
Game.highestScore = (score, highScore) => score > highScore ? score : highScore;

Game.parseHighScore = (level) => {
  if (level === 'easy') {
    this.easyScore = this.highestScore(this.score, this.easyScore);
    return this.easyScore;
  } else if (level === 'normal') {
    this.normalScore = this.highestScore(this.score, this.normalScore);
    return this.normalScore;
  } else {
    this.extremeScore = this.highestScore(this.score, this.extremeScore);
    return this.extremeScore;
  }
};

// game board
Game.board = {
  highScore: this.parseHighScore(this.level),
  toAppend: `<div class="game">
  <h1>TYPING GAME</h1>
  <h4 id="score">Score : ${this.score}
  Highscore: ${this.board.highScore}</h4>
  <div class="board"></div>
  <form>
  <input type="text" value="" class="typehere">
  </form>
  </div>`,
  toParse: function toParse() {
    return Game.board.toAppend;
  },
  wordDiv: () => {
    for (var i=0; i<20; i++) {
      $('.board').append('<div class="word"></div>');
    }
  }
};

// set variables
Game.setVars = (level) => {
  if (level === 'easy') {
    this.level = 'easy';
    this.interval = 3000;
    this.animationDuration = 17000;
  } else if (level === 'normal') {
    this.level = 'normal';
    this.interval = 1500;
    this.animationDuration = 12000;
  } else {
    this.level = 'extreme';
    this.interval = 500;
    this.animationDuration = 7000;
  }
},

// settings for each level
Game.easy = {
  parseBoard: () => {
    this.setVars('easy');
    Game.parseBoard.bind(Game)();
  }
};

Game.normal = {
  parseBoard: () => {
    this.setVars('normal');
    Game.parseBoard.bind(Game)();
  }
};

Game.extreme = {
  parseBoard: () => {
    this.setVars('extreme');
    Game.parseBoard.bind(Game)();
  }
};

// event listeners for level buttons
Game.init = () => {
  $('#easy').on('click', Game.easy.parseBoard);
  $('#normal').on('click', Game.normal.parseBoard);
  $('#extreme').on('click', Game.extreme.parseBoard);
};

$(Game.init);
