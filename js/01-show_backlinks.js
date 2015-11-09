/*
 * 01-show_backlinks.js - Show reply links beside posts' (with replies) header.
 *                        Add hover view to backlinks and reply links in a message.
 * 
 * Copyright (c) 2015 Lance Link <lance@bytesec.org>
 */
$('document').ready(function () {
  $('body').find('div.post').each(function() {
    check_backlinks(this);
  });
  function check_backlinks(post) {
    var id = $(post).data('id');
    var regExp = /\>\>[1$-9]{1,3}($|\s)/g;
    // Finds all reply in the message based on regex. Reply Format: ">>{n}"
    // regex: Where 0 < n < 1000, n should have white_space OR NULL on the right and any on the left (Based on how reply is created in threads)
    var msg_reply = $(post).find('.message').text().match(regExp);
    if (msg_reply) {
      msg_reply.forEach(function(e){
        e = e.trim().replace('>>','');
        if (e == id) return true;
        $('[data-id="' + e + '"]').find('.date').append('<span class="back-links"><a data-tooltip="'+id+'" href="'+$('#zxcvtypo').val()+"/"+id+'" onclick="highlightReply('+id+', \'hover\', event);">>>' + id + '</a></span>');
        // Add hover to backlink
        $('[data-tooltip="' + id + '"]').hover(function(e) {
          if ($('[data-id="' + id + '"]').length==0)
            return true;
          var onScreen = $('[data-id="' + id + '"]').inView();
          if (onScreen) {
            $('[data-id="' + id + '"]').css('background', '#EB9999');
          } else {
            var div_content = $("<div />").append($('[data-id="' + id + '"]').html()).html();
            $('[data-id="' + id + '"]').find('.date').append('<div id="hover-' + id + '" class="hoverAppend">'+ div_content +'</div>');
            $('#hover-' + id).css({
              left: e.pageX + 1,
              top: e.pageY + 1
            }).stop().show(100);
          }
        }, function() {
          if ($('[data-id="' + id + '"]').length==0)
            return true;
          var onScreen = $('[data-id="' + id + '"]').inView();
          if (onScreen) {
            $('[data-id="' + id + '"]').css('background', 'none');
          } else {
            $('#hover-' + id).remove();
          }
        });
      });
    }
  }
  // Loop to add hover to reply link in all messages
  $('.thread').find('.post').find('.message').find('a').each(function() {
    check_reply_links(this);
  });
  function check_reply_links(post) {
    var regExp = /\>\>[1$-9]{1,3}($|\s)/g;
    if ($(post).text().match(regExp)) {
      var id = $(post).text().substring(2);
      $(post).click(function(e) {
        highlightReply(id, "reply", e);
      });
      $(post).hover(function(e) {
        if ($('[data-id="' + id + '"]').length==0)
          return true;
        var onScreen = $('[data-id="' + id + '"]').inView();
        if (onScreen) {
          $('[data-id="' + id + '"]').css('background', '#EB9999');
        } else {
          var div_content = $("<div />").append($('[data-id="' + id + '"]').html()).html();
          $('[data-id="' + id + '"]').find('.message').append('<div id="reply-' + id + '" class="hoverAppend">'+ div_content +'</div>');
          $('#reply-' + id).css({
            left: e.pageX + 1,
            top: e.pageY + 1
          }).stop().show(100);
        }
      }, function() {
        var id = $(post).text().substring(2);
        if ($('[data-id="' + id + '"]').length==0)
          return true;
        var onScreen = $('[data-id="' + id + '"]').inView();
        if (onScreen) {
          $('[data-id="' + id + '"]').css('background', 'none');
        } else {
          $('#reply-' + id).remove();
        }
      });
    }
  }
  // Check if element is on screen function
  $.fn.inView = function() {
    var viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();
    var bounds = {};
    bounds.top = this.offset().top;
    bounds.bottom = bounds.top + this.outerHeight();
    return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom));
  };
  $(document).on('check_reply', function(e, post) {
    check_backlinks(post);
    $(post).find('.message').find('a').each(function() {
      check_reply_links(this);
    });
  });
});
function highlightReply(id, where, event) {
  if (!localStorage.backlinkOpen)
    localStorage.backlinkOpen = "true";
  if (localStorage.backlinkOpen == "false") {
    // Reposition page view to div id of clicked backlink if visible
    if($('#'+id).length != 0) {
      event.preventDefault();
      $('#'+where+'-' + id).remove();
      $("#"+id).get(0).scrollIntoView();
      $("#"+id).css('background', '#EB9999');
      $("#"+id).stop(true, true).animate({ backgroundColor: 'transparent' });
    } else {
      // Open link if not visible bypassing set option
      $(this).trigger('click');
    }
  }
}
