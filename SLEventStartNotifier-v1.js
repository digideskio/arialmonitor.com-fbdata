function HomePageNotifier(Options) {

    this.Options = {
        APIToken: "",
        WebsiteId: 0,
		TimeToStayOpen: 10000,
		Position: "TopRight",
		HowOftenToCheck: 10000,
		ShowCloseButton: true,
		LinkText: "<strong>[[EventTitle]]</strong> is starting now. Click here to watch live."
    };

    for (opt in Options) {
        this.Options[opt] = Options[opt];
    }
	
	this.LastTime = this.FormatDateUTC(new Date());

	this.InstanceIndex = HomePageNotifier.StoreInstance(this);

	this.NotifierQueue = new Array();

    this.IsjQueryAvailable = this.TestForjQuery();

    if (!this.IsjQueryAvailable) {
        this.AddjQuery();
    }

    this.GetAllEvents();

}

HomePageNotifier.Index = 0;

HomePageNotifier.GetInstance = function (pIndex) {
    if (HomePageNotifier.__instances == null) {
        return null;
    }
    else {
        return HomePageNotifier.__instances["" + pIndex];
    }

}

HomePageNotifier.StoreInstance = function (pHomePageNotifierInstance) {
    if (HomePageNotifier.__instances == null) {
        HomePageNotifier.__instances = new Array();
    }

    var _Index = HomePageNotifier.Index;
    HomePageNotifier.Index++;

    HomePageNotifier.__instances[_Index] = pHomePageNotifierInstance;

    return _Index;
}

HomePageNotifier.prototype.AnalyzeEvents = function (pResponse) {

    for (var i = 0; i < pResponse.Events.length; i++) {
        var EventStartTime = this.FormatDateUTC(eval("new " + (pResponse.Events[i].Start.replace(/\//g, ""))));
        if ((pResponse.Events[i].IsLive == 1) && (EventStartTime > this.LastTime)) {
            this.ConstructNotifier(pResponse.Events[i]);
            this.LastTime = this.FormatDateUTC(new Date());
        }
    }

    if (this.DetectNotifier() == false) {
        this.CheckQueue();
    }

    var CheckInterval = this.Options.HowOftenToCheck;
    if (CheckInterval < 10000) {
        CheckInterval = 10000;
    }

    var Wait = setTimeout("HomePageNotifier.GetInstance(" + this.InstanceIndex + ").GetAllEvents()", CheckInterval);

}

HomePageNotifier.prototype.ConstructNotifier = function (pEvent) {

    var Notifier = document.createElement("div");
    Notifier.id = pEvent.Id;
    Notifier.className = "Notifier";

    var NotifierContent = document.createElement("a");
    NotifierContent.href = this.GetEventUrl(pEvent);
    NotifierContent.innerHTML = this.Options.LinkText.replace(/\[\[EventTitle\]\]/g, pEvent.Title);

    Notifier.appendChild(NotifierContent);

    var CloseLink = document.createElement("a");
    CloseLink.href = "#";
    CloseLink.className = "CloseNotifier";
    CloseLink.innerHTML = "x";
    CloseLink.setAttribute("onclick", "HomePageNotifier.GetInstance(" + this.InstanceIndex + ").CloseNotifier(" + pEvent.Id + "); return false;");

    if (this.Options.ShowCloseButton == true) {
        Notifier.appendChild(CloseLink);
    }

    this.NotifierQueue.push(Notifier);

}

HomePageNotifier.prototype.DetectNotifier = function () {
    var NotifierFound = false;
	var divs = document.getElementsByTagName("div");
    for (i = 0; i < divs.length; i++) {
        if (divs[i].className == "Notifier") {
            NotifierFound = true;
        }
    }
	return NotifierFound;
}

HomePageNotifier.prototype.CheckQueue = function () {
    if (this.NotifierQueue.length > 0) {
        this.SlideIn(this.NotifierQueue[0]);
        this.NotifierQueue.splice(0, 1);
    }
}

HomePageNotifier.prototype.GetEventUrl = function (pEvent) {
	for (i=0; i<pEvent.Websites.length; i++) {
		if (pEvent.Websites[i].Id == this.Options.WebsiteId) {
			return pEvent.Websites[i].Url;	
		}
	}	
}

HomePageNotifier.prototype.FormatDateUTC = function (pDate) {
	var FormattedDate = Date.UTC(pDate.getUTCFullYear(),pDate.getUTCMonth(),pDate.getUTCDate(),pDate.getUTCHours(),pDate.getUTCMinutes(),pDate.getUTCSeconds());
	return FormattedDate;
}

HomePageNotifier.prototype.SlideIn = function (pElement) {
    if (document.getElementById(pElement.id) == null) {
        pElement.style.visibility = "hidden";
        pElement.style.position = "absolute";
        if (this.Options.Position == "TopRight") {
            pElement.style.top = "0";
            pElement.style.right = "20px";
        } else if (this.Options.Position == "TopLeft") {
            pElement.style.top = "0";
            pElement.style.left = "20px";
        } else if (this.Options.Position == "BottomLeft") {
            pElement.style.bottom = "0";
            pElement.style.left = "20px";
        } else if (this.Options.Position == "BottomRight") {
            pElement.style.bottom = "0";
            pElement.style.right = "20px";
        }
        document.body.appendChild(pElement);
        var ElementHeight = pElement.offsetHeight;
        pElement.style.height = "0px";
        pElement.style.visibility = "visible";
        $("#" + pElement.id).animate({
            height: ElementHeight + "px"
        }, 1000, this.SlideOut(pElement.id));
    }
}

HomePageNotifier.prototype.SlideOut = function (pElementId) {
    var T = this;
    var SlideOutWait = setTimeout(function () {
        $('#' + pElementId).animate({ height: 0 }, 1000, function () {
            var NotifierToRemove = document.getElementById(pElementId);
            NotifierToRemove.parentNode.removeChild(NotifierToRemove);
            T.CheckQueue();
        });
    }, this.Options.TimeToStayOpen);
}

HomePageNotifier.prototype.CloseNotifier = function (pElementId) {
    var NotifierToRemove = document.getElementById(pElementId);
    NotifierToRemove.parentNode.removeChild(NotifierToRemove);
    this.CheckQueue();
}

HomePageNotifier.prototype.TestForjQuery = function () {
    if (this.IsjQueryAvailable != null) {
        return this.IsjQueryAvailable;
    } else {
        this.IsjQueryAvailable = false;
        try {
            this.IsjQueryAvailable = (jQuery != null);
        }
        catch (Error) { }
        return this.IsjQueryAvailable;
    }
}

HomePageNotifier.prototype.AddjQuery = function () {
	
	var jQuery = document.createElement("script");
    jQuery.type = "text/javascript";
    jQuery.src = "http://embed.scribblelive.com/js/jquery.js";
    document.getElementsByTagName("head")[0].appendChild(jQuery);
	
}

HomePageNotifier.prototype.GetAllEvents = function () {	
	
	var Scripts = document.head.getElementsByTagName("script");
    for (var i = 0; i < Scripts.length; i++) {
        ScriptSource = Scripts[i].src;
        if (ScriptSource.match("^\http:\/\/apiv1\.scribblelive\.com/website/" + this.Options.WebsiteId + ".*") != null) {
            document.head.removeChild(Scripts[i]);
        }
    }
	
	var LoadPostsCall = document.createElement("script");
    LoadPostsCall.type = "text/javascript";
    LoadPostsCall.src = "http://apiv1.scribblelive.com/website/" + this.Options.WebsiteId + "/events/?Token=" + this.Options.APIToken + "&format=json&callback=HomePageNotifier.GetInstance(" + this.InstanceIndex + ").AnalyzeEvents";
    document.getElementsByTagName("head")[0].appendChild(LoadPostsCall);	
	
}