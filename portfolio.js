Posts = new Meteor.Collection("posts");

if (Meteor.isClient) {
  Template.posts.posts = function () {
    return Posts.find({});
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

      var count = 0;
      $(".project-box").each(function () {
        $(this).children(".meta").children(".tag").each(function (index, elem) {
          if($(event.target).text() == $(elem).text()) {
            count += 1;
          }
        });
        if (count == 0) {
          $(this).hide();
        } else {
          $(this).show();
        }
        count = 0;
      });
    }
  });

  Template.tags_menu.events({
    'click .tag' : function (event) {
      $(".tags_menu > .tag").removeClass('selected');
      $(event.target).addClass('selected');
      if ($(event.target).text() == "All") {
        $(".project-box").each(function () {
          $(this).show();
        });
      } else {
        var count = 0;
        $(".project-box").each(function () {
          $(this).children(".meta").children(".tag").each(function (index, elem) {
            if($(event.target).text() == $(elem).text()) {
              count += 1;
            }
          });
          if (count == 0) {
            $(this).hide();
          } else {
            $(this).show();
          }
          count = 0;
        });
      }
    }
  });

  Meteor.startup(function () {
    var smallHeaderHeight = parseInt($(".small-header").css("height"));
    var smallHeaderTop = $(".small-header").offset().top;

    $(window).scroll(function() {
      if($(window).scrollTop() > $(".small-header").offset().top) {
        $(".small-header").addClass('sticky');
        $(".h1").removeClass("hidden").addClass("shown");
        // TODO: animate instead of hiding abruptly
        $(".content").css({ paddingTop: smallHeaderHeight + 40 + "px" });
      } else if ($(window).scrollTop() <= smallHeaderTop) {
        $(".small-header").removeClass('sticky');
        $(".content").css({ paddingTop: "40px" });
        $(".h1").removeClass("shown").addClass("hidden");
      }
    });

    $(window).resize(function () {
      // moreDropdown();
    });
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
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["Ruby on Rails", "Backbone", "Animation"],
          date: "Nov 13, 2013"
        },
        {
          title: "99 Cats",
          url: "http://www.passwordlet.com",
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["JavaScript"],
          date: "Nov 13, 2013"
        },
        {
          title: "Asteroids",
          url: "http://www.passwordlet.com",
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["Sketch"],
          date: "Nov 13, 2013"
        },
        {
          title: "Snake",
          url: "http://www.passwordlet.com",
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["JavaScript"],
          date: "Nov 13, 2013"
        },
        {
          title: "Command Line Chess",
          url: "http://www.passwordlet.com",
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["Ruby"],
          date: "Nov 13, 2013"
        },
        {
          title: "Ruby Idioms",
          url: "http://www.passwordlet.com",
          img: "http://placekitten.com/300/300",
          desc: "Final project at App Academy.",
          tags: ["Ruby on Rails"],
          date: "Nov 13, 2013"
        }
      ];

      for(var i = 0; i < data.length; i++) {
        Posts.insert({
          title: data[i].title,
          url: data[i].url,
          img: data[i].img,
          desc: data[i].desc,
          tags: data[i].tags,
          date: data[i].date
        });
      }
    }
  });
}