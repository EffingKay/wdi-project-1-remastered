'use strict';

var Game = Game || {};

// creates a board which will be populated with random words , plus removes eerything from last shown screen
Game.score = 0;
Game.score = 0;
Game.currentWords = [];
Game.easyScore = 0;
Game.normalScore = 0;
Game.extremeScore = 0;
Game.level = 'easy';

// game over screen
Game.gameOverScreen = function () {
  var highScore = Game.parseHighScore(Game.level);
  var toAppend = '<div class="landingScreen">\n                  <h1>TYPING GAME</h1>\n                  <h2>Your final score is: ' + Game.score + ' <br>\n  Highscore: ' + highScore + '           <br>      Wanna play again?</h2>\n                  <button type="button" id="easy">Easy</button>\n                  <button type="button" id="normal">Normal</button>\n                  <button type="button" id="extreme">Extreme</button>\n                  </div> ';
  $('main').append(toAppend).fadeIn();
  $('.game').fadeOut();
  Game.init();
};

// game over
Game.gameOver = function () {
  $('.board').children().stop().remove();
  $('.game').remove();
  Game.gameOverScreen();
};

// checks if the word submitted matched any word in a currentWords array
Game.doesMatch = function (e) {
  e.preventDefault();
  var typed = $('input').val();
  Game.currentWords.indexOf(typed) > -1 ? Game.matchFound() : Game.matchNotFound();
};

Game.matchFound = function () {
  var typed = $('input').val();
  var boardChildrenArray = $('.board').children();
  var index = Game.currentWords.indexOf(typed);
  Game.currentWords.splice(index, 1);
  $(boardChildrenArray).each(function (i, elem) {
    if ($(elem).text() === typed) {
      $(elem).text('').finish().css('marginLeft', '0px');
    }
  });
  $('input').val('');
  Game.doesMatch;
  Game.score++;
  $('#score').html('Score: ' + Game.score);
  Game.changeBackground();
};

Game.matchNotFound = function () {
  $('input').val('').effect('highlight');
};

Game.changeBackground = function () {
  var randomColors = ['#FF1962', '#8EE0F2', '#F5BB00', '#18A346', '#2EC4B6', '#8EA604', '#B84256', '#68EDCC', '#F16146', '#F25959', '#0EAD69', '#FF4E00', '#FF3338', '#00ACAE', '#FFFF5D', '#0090C9', '#EC9F05', '#EE4266'];
  var randomNumber = Math.floor(Math.random() * (randomColors.length - 1)) + 1;
  $('body').css('backgroundColor', randomColors[randomNumber]);
};

// generates a word every x seconds

// animate the word across the board
Game.animateWord = function (word) {
  var $windowWidth = $(window).width() + 'px';
  $(word).animate({
    marginLeft: $windowWidth
  }, Game.animationDuration, function () {
    if ($(word).text() !== '') {
      Game.gameOver();
    }
  });
};

// parse a word in the board div and push it to currentWords array
Game.parseWord = function (word) {
  var randomNumber = Math.floor(Math.random() * 19) + 1;
  var boardChildrenArray = $('.board').children();
  if ($(boardChildrenArray[randomNumber]).html() === '') {
    boardChildrenArray[randomNumber].append(word);
    Game.currentWords.push(word);
    Game.animateWord(boardChildrenArray[randomNumber]);
  }
};

// generates a random word and parse it to the board
Game.randomWord = function () {
  var randomNumber = Math.floor(Math.random() * (window.words.length - 1)) + 1;
  Game.parseWord(window.words[randomNumber]);
};

// creates a board which will be populated with random words , plus removes eerything from last shown screen
Game.parseBoard = function () {
  this.currentWords = [];
  this.score = 0;
  $('.landingScreen').remove();
  $('main').append(this.board.toParse());
  this.board.wordDiv();
  $('form').on('submit', this.doesMatch);
  $('input').focus();
  setInterval(Game.randomWord, Game.interval);
  console.log(Game.level, Game.interval);
};

// determine high score
Game.highestScore = function (score, highScore) {
  return score > highScore ? score : highScore;
};

Game.parseHighScore = function (level) {
  if (level === 'easy') {
    Game.easyScore = Game.highestScore(Game.score, Game.easyScore);
    return Game.easyScore;
  } else if (level === 'normal') {
    return Game.highestScore(Game.score, Game.normalScore);
  } else {
    return Game.highestScore(Game.score, Game.extremeScore);
  }
};

// game board
Game.board = {
  toAppend: '<div class="game">\n             <h1>TYPING GAME</h1>\n             <h4 id="score">Score : ' + Game.score + '</h4>\n             <div class="board"></div>\n             <form>\n             <input type="text" value="" class="typehere">\n             </form>\n             </div>',
  toParse: function toParse() {
    return Game.board.toAppend;
  },
  wordDiv: function wordDiv() {
    for (var i = 0; i < 20; i++) {
      $('.board').append('<div class="word"></div>');
    }
  }
};

// set variables
Game.setVars = function (level) {
  if (level === 'easy') {
    Game.level = 'easy';
    Game.interval = 3000;
    Game.animationDuration = 17000;
  } else if (level === 'normal') {
    Game.level = 'normal';
    Game.interval = 1500;
    Game.animationDuration = 12000;
  } else {
    Game.level = 'extreme';
    Game.interval = 500;
    Game.animationDuration = 7000;
  }
};

// settings for each level
Game.easy = {
  parseBoard: function parseBoard() {
    Game.setVars('easy');
    Game.parseBoard.bind(Game)();
  }
};

Game.normal = {
  parseBoard: function parseBoard() {
    Game.setVars('normal');
    Game.parseBoard.bind(Game)();
  }
};

Game.extreme = {
  parseBoard: function parseBoard() {
    Game.setVars('extreme');
    Game.parseBoard.bind(Game)();
  }
};

// event listeners for level buttons
Game.init = function () {
  $('#easy').on('click', Game.easy.parseBoard);
  $('#normal').on('click', Game.normal.parseBoard);
  $('#extreme').on('click', Game.extreme.parseBoard);
};

$(Game.init);
