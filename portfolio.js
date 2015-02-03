Posts = new Meteor.Collection("posts");
SocialLinks = new Meteor.Collection("social_links");

if (Meteor.isClient) {

  Session.setDefault('post_id', 0);

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
          title: "Balanced Dashboard",
          url: "http://dashboard.balancedpayments.com",
          img: "images/balanced-dashboard.png",
          desc: "Revamped the dashboard to visualize complex funds flows for marketplace owners.",
          github: "https://github.com/balanced/balanced-dashboard",
          tags: ["Ember.js", "Handlebars", "Less", "Grunt", "UX Design", "Product"],
          date: "Jan 2014 – Feb 2015"
        },
        {
          title: "Google Cloud Console",
          url: "https://console.developers.google.com",
          img: "images/cloud-console.png",
          desc: "Converted App Engine and APIs Console into the new Google Cloud Console UI.",
          tags: ["UX Design"],
          date: "May 2012 – Aug 2013"
        },
        {
          title: "DoubleClick for Advertisers",
          url: "http://www.google.com/doubleclick/advertisers",
          img: "images/doubleclick.png",
          desc: "Redesigned the UI to support complex ad trafficking workflows – batch editing, custom filtering, etc.",
          tags: ["UX Design"],
          date: "Jan 2010 – May 2012"
        },
        {
          title: "Medium Blog",
          url: "https://medium.com/@kyungmink/latest",
          img: "images/medium.png",
          desc: "Where I write about my career adventures and thoughts on design.",
          tags: ["Writing"],
          date: "Jul 2013 – Present"
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
    }
  });
}