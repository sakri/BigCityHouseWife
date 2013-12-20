/**
 * Created by sakri on 16-12-13.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //BCHW HOME

        concat: {
            dist: {
                files: {

                    'js/bchw.js': ["js/TweetsManager.js",
                        "js/BlogPostsManager.js",
                        "js/BCHWMathUtil.js",
                        "js/BCHWGeom.js",
                        "js/UnitAnimator.js",
                        "js/BCHWArrayUtil.js",
                        "js/BCHWLayout.js",
                        "js/BCHWColor.js",
                        "js/BCHWFont.js",
                        "js/BCHWLogo.js",
                        "js/BCHWCharacters.js",
                        "js/BCHWSpeechBubble.js",
                        "js/BCHWMain.js"],

                    'js/games/bchwMemoryGame.js': ["js/BCHWMathUtil.js",
                        "js/BCHWGeom.js",
                        "js/UnitAnimator.js",
                        "js/BCHWArrayUtil.js",
                        "js/BCHWImageStore.js",
                        "js/BCHWColor.js",
                        "js/TransformRectangle.js",
                        "js/games/MemoryGameCardFlip.js",
                        "js/games/BCHWMemoryGameGridCell.js",
                        "js/games/MemoryGameCardPrep.js",
                        "js/BCHWLayout.js",
                        "js/BCHWFont.js",
                        "js/games/MemoryGameLogo.js",
                        "js/games/BCHWMemoryGame.js"]
                }
            }
        },
        /*
        concat: {

            dist: {
                src: [
                    "js/TweetsManager.js",
                    "js/BlogPostsManager.js",
                    "js/BCHWMathUtil.js",
                    "js/BCHWGeom.js",
                    "js/UnitAnimator.js",
                    "js/BCHWArrayUtil.js",
                    "js/BCHWLayout.js",
                    "js/BCHWColor.js",
                    "js/BCHWFont.js",
                    "js/BCHWLogo.js",
                    "js/BCHWCharacters.js",
                    "js/BCHWSpeechBubble.js",
                    "js/BCHWMain.js"

                ],
                dest: 'js/bchw.js'
            },
            dist: {
                src: [
                    "js/BCHWMathUtil.js",
                    "js/BCHWGeom.js",
                    "js/UnitAnimator.js",
                    "js/BCHWArrayUtil.js",
                    "js/BCHWImageStore.js",
                    "js/BCHWColor.js",
                    "js/TransformRectangle.js",
                    "js/games/MemoryGameCardFlip.js",
                    "js/games/BCHWMemoryGameGridCell.js",
                    "js/games/MemoryGameCardPrep.js",
                    "js/BCHWLayout.js",
                    "js/BCHWFont.js",
                    "js/games/MemoryGameLogo.js",
                    "js/games/BCHWMemoryGame.js"

                ],
                dest: 'js/games/bchwMemoryGame.js'
            }
        },*/

        uglify: {

            dist: {
                files: {
                    'js/bchw.min.js':'js/bchw.js',
                    'js/games/bchwMemoryGame.min.js': 'js/games/bchwMemoryGame.js'
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);

};