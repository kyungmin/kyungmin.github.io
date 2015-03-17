Posts = new Meteor.Collection("posts");
SocialLinks = new Meteor.Collection("social_links");

if (Meteor.isClient) {

  Session.setDefault('post_id', 0);

  Template.posts.helpers({
    posts: function () {
      return Posts.find({});
    },

    first_item: function () {
      return this.post_id % 3 == 0;
    },

    github_present: function () {
      return this.github ? true : false;
    }
  });

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

  Template.tags.helpers({
    tags: function () {
      var post_id = this._id;
      return _.map(this.tags || [], function (tag) {
        return { post_id: post_id, tag: tag };
      });
    }
  });

  Template.tags_menu.helpers({
    tags: function () {
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

  Template.ga.helpers({
    gaKey: function () {
      return Meteor.settings.public.ga.account;
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
      var posts = JSON.parse(Assets.getText("projects.json")).posts;

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