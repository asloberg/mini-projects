
jQuery(function() {
    //*********** Progress Bar Sync *************\\
    const $video = $('video');
    const $progress = $('#progress');

    $video.on("timeupdate", function() {
        const progressValue = ($video[0].currentTime / $video[0].duration) * 100;
        $progress.val(progressValue);
    })

    $progress.on("input", function() {
        $video[0].currentTime = ($progress.val() / 100) * $video[0].duration;
    })

    //*********** Play/Pause Func *************\\
    const $playPauseBtn = $('.play-pause-button');

    function pauseVideo() {
        $video[0].pause();
        $playPauseBtn.html('<i class="bi bi-play-fill"></i>');
    }

    $playPauseBtn.on("click", function() {
        if ($video[0].paused) {
            $video[0].play();
            $playPauseBtn.html('<i class="bi bi-pause-fill"></i>');
        } else {
            pauseVideo();
        }
    })

    //*********** Stop Func *************\\
    const $stopBtn = $('.stop-button');
    $stopBtn.on("click", function() {
        $video[0].currentTime = 0;
        if ($video[0].play) {
            pauseVideo();
        }
    })

    //*********** Fullscreen Func *************\\
    const $fullscreenBtn = $('.fullscreen-button');
    $fullscreenBtn.on("click", function() {
        const $videoDivContainer = $(".js-select")

        if (document.fullscreenElement) {
            document.exitFullscreen().then();
            $videoDivContainer.removeClass("fullscreen-container").addClass("player-container");
        } else {
            document.documentElement.requestFullscreen().then();
            $videoDivContainer.removeClass("player-container").addClass("fullscreen-container");
        }

    })

    //*********** Setting Func *************\\
    $('#settings-toggle').on('click', function() {
        const $settingContent = $('#settings-menu');
        const $settingButtonIcon = $(this).find('i');

        const buttonPosition = $(this).offset();

        //dropdown 10px below the setting btn
        $settingContent.css({
            top: buttonPosition.top + $(this).outerHeight() + 10 + 'px',
            left: buttonPosition.left + 'px'
        });

        $settingContent.toggleClass('active');

        if ($settingContent.hasClass('active')) {
            $settingButtonIcon.css('color', 'white');
        } else {
            $settingButtonIcon.css('color', '');
        }
    });
    //playback speed func
    $('#playbackRate').on('change', function() {
        $video[0].playbackRate = $(this).val();
    });
});