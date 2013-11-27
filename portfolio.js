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

  Template.posts.events({
    'click .img' : function () {
      console.log(this);
    }
  });

  Template.tags.events({
    'click .tag' : function () {
      console.log(this);
    }
  });

  $(document).ready(function(){
    var bigHeaderHeight = parseInt($(".big-header").css("height"));
    var smallHeaderHeight = parseInt($(".small-header").css("height"));
    var smallHeaderTop = $(".small-header").offset().top;

    $(window).scroll(function() {
      if($(window).scrollTop() > $(".small-header").offset().top) {
        $(".small-header").addClass('sticky');
        $(".h1").removeClass("hidden").addClass("shown");
        // TODO: animate instead of hiding abruptly
        $(".content").css({ marginTop: (smallHeaderHeight + 40) + "px" });
      } else if ($(window).scrollTop() <= smallHeaderTop) {
        $(".small-header").removeClass('sticky');
        $(".content").css({ marginTop: "40px" });
        $(".h1").removeClass("shown").addClass("hidden");
      }
    });
  });

  $(".small-header > .tag").each(function() {
    var rightEdge = parseInt($(this).css("width")) + $(this).offset().left;
    console.log(rightEdge);
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
          tags: ["Ruby on Rails", "Backbone", "Animate"],
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