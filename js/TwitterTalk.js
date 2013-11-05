/*

Constrained to a canvas width and height

The idea is that the layoutManager can have a "default value" for horizontalLayout, in the event that all lines
are to use the same horizontalLayout.  It must however remain possible for individual rows to have their own settings.

Same goes for gap

Consider putting all 3 classes within one self excecuting function or "namespace"

*/

	//==================================================
	//===================::LAYOUT MANAGER::=============
	//==================================================

(function (window){

	TwitterTalkManager.SAVED_TWEETS_PATH="/savedTweets/";
	
	TwitterTalkManager.CHARACTER_NAMES=["mom","dad","son","daughter"];
	TwitterTalkManager.TWITTER_HANDLES=["B_C_H_W","bchw_dad","bchw_son","bchw_girl"];

	TwitterTalkManager=function(){

	}
	
	LayoutManager.prototype.loadTweets=function(){

	}
	
	LayoutManager.prototype.getNextCharacter=function(){

	}

	window.TwitterTalkManager=TwitterTalkManager;
}(window));