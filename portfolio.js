Posts = new Meteor.Collection("posts");

if (Meteor.isClient) {

  Session.setDefault('post_id', 0);

  Template.posts.posts = function () {
    return Posts.find({});
  };

  Template.posts.first_item = function () {
    return this.post_id % 3 == 0;
  };

  Template.posts.rendered = function () {
    var maxHeight = 0;

    $(".project-box > .desc").each(function () {
      if ($(this).height() > maxHeight) {
        maxHeight = $(this).height(); 
      }
    });

    $(".project-box > .desc").each(function () {
      $(this).height(maxHeight);
    });
  };

  Template.tags.tags = function () {
    var post_id = this._id;
    return _.map(this.tags || [], function (tag) {
      return { post_id: post_id, tag: tag };
    });
  };

  Template.tags_menu.tags = function () {
    var tags = [];

    Posts.find({}).forEach(function (post) {
      _.each(post.tags, function (tag) {
        var tag_exists = _.find(tags, function (t) {
          return t.tag === tag;
        });
        if (!tag_exists) {
          tags.push({tag: tag});
        }
      });
    });
    return tags;
  };

  Template.tags_menu.rendered = function () {
    var menuWidth = 0;

    $(".tags_menu > .tag").each(function () {
      menuWidth += parseInt($(this).css("width"));
    });
    $(".tags_menu").width(menuWidth);
    $(".tags_menu").css("margin", "0 auto");
  };

  Template.posts.events({
    'click .img' : function () {
      console.log(this);
    }
  });

  Template.tags.events({
    'click .tag' : function (event) {
      $(".tags_menu > .tag").removeClass('selected');
      $(".tags_menu > .tag").filter(":contains('" + $(event.target).text() + "')").addClass('selected');

      var tagCount = 0;
      $(".project-box").each(function () {
        $(this).children(".meta").children(".tag").each(function (index, elem) {
          if($(event.target).text() == $(elem).text()) {
            tagCount += 1;
          }
        });
        if (tagCount == 0) {
          $(this).parents('.post').removeClass('bounceInUp');
          $(this).parents('.post').addClass('bounceOutDown');
        } else {
          $(this).parents('.post').removeClass('bounceOutDown')
          $(this).parents('.post').addClass('bounceInUp');
        }
        tagCount = 0;
      });
    }
  });

  Template.tags_menu.events({
    'click .tag' : function (event) {
      $(".tags_menu > .tag").removeClass('selected');
      $(event.target).addClass('selected');
      if ($(event.target).text() == "All") {
        $(".project-box").each(function () {
          $(this).parents('.post').removeClass('bounceOutDown')
          $(this).parents('.post').addClass('bounceInUp');
        });
      } else {
        var tagCount = 0;
        $(".project-box").each(function () {
          $(this).children(".meta").children(".tag").each(function (index, elem) {
            if($(event.target).text() == $(elem).text()) {
              tagCount += 1;
            }
          });
          if (tagCount == 0) {
            $(this).parents('.post').removeClass('bounceInUp');
            $(this).parents('.post').addClass('bounceOutDown');
          } else {
            $(this).parents('.post').removeClass('bounceOutDown')
            $(this).parents('.post').addClass('bounceInUp');
          }
          tagCount = 0;
        });
      }
    }
  });

  Meteor.startup(function () {
      $(".small-header > .h1").click(function(event) {
        $("html, body").animate({scrollTop: 0}, "slow");
        return false;
      });

      // $("#hire-kk").hover(function(event) {
      //   $(this).addClass('animated pulse');
      // }, function(event) {
      //   $(this).removeClass('animated pulse');
      // });

      var smallHeaderHeight = parseInt($(".small-header").css("height"));
      var smallHeaderTop = $(".small-header").offset().top;
      var sticky;

      $(window).scroll(function() {
        if(!sticky && $(window).scrollTop() > $(".small-header").offset().top) {
          $(".small-header").addClass('sticky');
          $(".h1").removeClass("transparent").addClass("opaque").addClass("expand");
          // TODO: animate instead of hiding abruptly
          $(".content").css({ paddingTop: smallHeaderHeight + 40 + "px" });
          sticky = true;
        } else if (sticky && $(window).scrollTop() <= smallHeaderTop) {
          $(".small-header").removeClass('sticky');
          $(".content").css({ paddingTop: "40px" });
          $(".h1").removeClass("opaque").addClass("transparent").removeClass("expand");
          sticky = false;
        }
      });

      $(window).resize(function () {
        // moreDropdown();
      });
  });

  Handlebars.registerHelper('iterate', function(context, limit, options) {
      var ret = "";
      console.log(context.length);
      if (context.length > 0) {
          ret += "<div>";
          for(var i=0, j=context.length; i<j; i++) {
            ret = ret + options.fn(context[i]);
            if ( (i+1) % limit === 0 ) {
                ret += "</div><div>";
            }
          }
          ret += "</div>";
      }
      return ret;
  });


  Handlebars.registerHelper("eachpost", function(optionalValue) { 
    var that = this;
    
      $(".post[data-id=" + that.post_id +"]").removeClass('hidden');
      $(".post[data-id=" + that.post_id +"]").addClass('animated bounceInUp');
    
  });

  Handlebars.registerHelper('forevery', function(context, limit, options) {
      var ret = "";
      debugger
      console.log(context.length);
      if (context.length > 0) {
          ret += "<div>";
          for(var i=0, j=context.length; i<j; i++) {
            ret = ret + options.fn(context[i]);
            if ( (i+1) % limit === 0 ) {
                ret += "</div><div>";
            }
          }
          ret += "</div>";
      }
      return ret;
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Posts.remove({});
    if (Posts.find().count() === 0) {
      var data = [
        {
          title: "Passwordlet",
          url: "http://www.passwordlet.com",
          img: "images/passwordlet.png",
          desc: "Final project at App Academy for 2 weeks. Passwordlet securely stores user credentials and automatically logs in users with cookies.",
          github: "https://github.com/kyungmin/passwordlet",
          tags: ["Ruby on Rails", "Backbone", "jQuery"],
          date: "Nov 13, 2013"
        },
        {
          title: "99Cats",
          url: "https://github.com/kyungmin/NinetyNineCats-v2",
          img: "http://placekitten.com/300/300",
          desc: "Full Rails application with multiple associations. 99Cats lets users make reservations on cat rentals.",
          github: "https://github.com/kyungmin/NinetyNineCats-v2",
          tags: ["Ruby on Rails"],
          date: "Nov 13, 2013"
        },
        {
          title: "Snake",
          url: "http://goo.gl/oCcvkc",
          img: "images/snake.png",
          desc: "Object-oriented JavaScript game with HTML and CSS.",
          github: "https://github.com/kyungmin/snake",
          tags: ["JavaScript"],
          date: "Oct 24, 2013"
        },
        {
          title: "Asteroids",
          url: "http://goo.gl/WJwyDI",
          img: "images/asteroids.png",
          desc: "Object-oriented JavaScript game rendered on HTML5 canvas.",
          github: "https://github.com/kyungmin/asteroids",
          tags: ["JavaScript", "Canvas"],
          date: "Oct 23, 2013"
        },
        {
          title: "Command Line Chess",
          url: "http://www.passwordlet.com",
          img: "images/chess.jpg",
          desc: "Command line chess program in Ruby.",
          github: "https://github.com/kyungmin/chess",
          tags: ["Ruby"],
          date: "Sep 24, 2013"
        }
      ];

      for(var i = 0; i < data.length; i++) {
        Posts.insert({
          post_id: i,
          title: data[i].title,
          url: data[i].url,
          img: data[i].img,
          desc: data[i].desc,
          github: data[i].github,
          tags: data[i].tags,
          date: data[i].date
        });
      }
    }
  });
}