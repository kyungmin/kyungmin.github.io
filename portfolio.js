Posts = new Meteor.Collection("posts");
SocialLinks = new Meteor.Collection("social_links");

if (Meteor.isClient) {

  Session.setDefault('post_id', 0);

  Template.social_links.links = function () {
    return SocialLinks.find({});
  };

  Template.posts.posts = function () {
    return Posts.find({});
  };

  Template.posts.first_item = function () {
    return this.post_id % 3 == 0;
  };

  Template.posts.github_present = function () {
    return this.github ? true : false;
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
        $(this).children(".meta").children(".tags").children(".tag").each(function (index, elem) {
          if($(event.target).text() == $(elem).text()) {
            tagCount += 1;
          }
        });
        if (tagCount == 0) {
          $(this).parents('.post').removeClass('bounceInUp');
          $(this).parents('.post').addClass('bounceOutDown');
        } else {
          $(this).parents('.post').removeClass('bounceOutDown');
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
          $(this).parents('.post').removeClass('bounceOutDown');
          $(this).parents('.post').addClass('bounceInUp');
        });
      } else {
        var tagCount = 0;
        $(".project-box").each(function () {
          $(this).children(".meta").children(".tags").children(".tag").each(function (index, elem) {
            if($(event.target).text() == $(elem).text()) {
              tagCount += 1;
            }
          });
          if (tagCount == 0) {
            $(this).parents('.post').removeClass('bounceInUp');
            $(this).parents('.post').addClass('bounceOutDown');
          } else {
            $(this).parents('.post').removeClass('bounceOutDown');
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

    var smallHeaderHeight = parseInt($(".small-header").css("height"));
    var smallHeaderTop = $(".small-header").offset().top;
    var sticky;

    $(window).scroll(function() {
      if(!sticky && $(window).scrollTop() > $(".small-header").offset().top) {
        $(".small-header").addClass('sticky');
        $(".h1").removeClass("transparent").addClass("opaque").addClass("expand");
        $(".content").css({ paddingTop: smallHeaderHeight + 40 + "px" });
        sticky = true;
      } else if (sticky && $(window).scrollTop() <= smallHeaderTop) {
        $(".small-header").removeClass('sticky');
        $(".content").css({ paddingTop: "40px" });
        $(".h1").removeClass("opaque").addClass("transparent").removeClass("expand");
        sticky = false;
      }
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Posts.remove({});
    SocialLinks.remove({});

    if (Posts.find().count() === 0) {
      var posts = [
        {
          title: "Passwordlet",
          url: "http://www.passwordlet.com",
          img: "images/passwordlet.png",
          desc: "Passwordlet securely stores user credentials and automatically logs users in using cookies.",
          github: "https://github.com/kyungmin/passwordlet",
          tags: ["Ruby on Rails", "Backbone.js", "jQuery", "CSS"],
          date: "Nov 13, 2013"
        },
        {
          title: "Snake",
          url: "http://goo.gl/oCcvkc",
          img: "images/snake.png",
          desc: "Object-oriented JavaScript game with HTML and CSS.",
          github: "https://github.com/kyungmin/snake",
          tags: ["JavaScript", "CSS"],
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
        },
        {
          title: "Governance Toolkit",
          url: "http://goo.gl/gJplG",
          img: "images/governance-toolkit.png",
          desc: "Prototype to demonstrate an idea to represent complex dataset.",
          tags: ["jQuery", "CSS"],
          date: "Sep 24, 2011"
        }
      ];

      var links = [
        {
          name: "linkedin",
          link: "http://www.linkedin.com/in/kyungmink"
        },
        {
          name: "github",
          link: "https://github.com/kyungmin"
        },
        {
          name: "tumblr",
          link: "http://app-academy-kyungmin.tumblr.com"
        },
        {
          name: "medium",
          link: "https://medium.com/@kyungmink"
        },
        {
          name: "instagram",
          link: "http://instagram.com/kyungminkk"
        },
        {
          name: "twitter",
          link: "https://twitter.com/kyungmink"
        }
      ];

      for(var i = 0; i < posts.length; i++) {
        Posts.insert({
          post_id: i,
          title: posts[i].title,
          url: posts[i].url,
          img: posts[i].img,
          desc: posts[i].desc,
          github: posts[i].github,
          tags: posts[i].tags,
          date: posts[i].date
        });
      }

      for(var i = 0; i < links.length; i++) {
        SocialLinks.insert({
          name: links[i].name,
          link: links[i].link
        });
      }
 
    }
  });
}