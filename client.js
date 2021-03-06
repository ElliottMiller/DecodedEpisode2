var selectedPackage = null;
function renderContributors(contributors) {
    $("#contributors_container").show();
    $("#contributors_title span").html(selectedPackage);
    var $container = $("#contributors tbody");
    $container.html("");
    $.each(contributors, function (idx, contributor) {
        $container.append("<tr>" +
            "<td><img src='" + contributor.avatar_url + "' /></td>" +
            "<td>" + contributor.login + "</td>" +
            "<td>" + contributor.contributions + "</td>" +
            "</tr>");
    });
}
function renderRepos(repos) {
    var $container = $("#repos tbody");
    $container.html("");
    $.each(repos, function (idx, repo) {
        var btnClass = "btn-default";
        if (repo.favorite) {
            btnClass = "btn-success";
        }
        $container.append("<tr>" +
            '<td><a data-repo="' + repo.name + '" href="#" class="favorite btn ' + btnClass + '"><span class="glyphicon glyphicon-star"></span></a></td>' +
            "<td><a class='repo' href='#'>" + repo.name + "</a></td>" +
            "</tr>");
    });
    $(".repo").click(function (e) {
        var userName = $(e.target).html();
        selectedPackage = userName;
        $.ajax({
            url: "/contributors/" + userName,
            success: function (result) {
                renderContributors(result);
            }
        });
    });
    $(".favorite").click(function (e) {
        e.preventDefault();
        var $button = $(e.target).closest("a");
        var isFavorite = $button.hasClass("btn-default");
        $.ajax({
            url: "/favorite/" + $button.attr("data-repo"),
            type: 'post',
            data: {
                isFavorite: isFavorite
            },
            success: function (data) {
                if (isFavorite) {
                    $button.removeClass("btn-default").addClass("btn-success");
                }
                else {
                    $button.removeClass("btn-success").addClass("btn-default");
                }
            }
        });
    });
}
function getRepos() {
    $.ajax({
        url: "/packages",
        success: function (result) {
            renderRepos(result);
        }
    });
}
$(document).ready(function () {
    getRepos();
    $("#login").click(function (e) {
        e.preventDefault();
        var identity = new Kurve.Identity("212065fa-ca9e-472a-8b0e-84a0b36c5f64", window.location.origin + "/login.html");
        identity.login(function (error) {
            if (identity.isLoggedIn()) {
                curUser = identity.getIdToken();
                document.getElementById("contributors_container").style.display = "none";
                document.getElementById("login").style.display = "none";
                getPackages();
            }
        });
    });
});
