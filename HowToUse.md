# The Javascript File #

  * Download the Javascript file from the source section of this website.
  * Add that Javascript file to your website, preferably in the head.

# Creating a New Notifier #

Add the following javascript to your page:

```
<script type="text/javascript">
    var First = new HomePageNotifier({
	APIToken: YourAPIToken,
	WebsiteId: YourWebsiteId,
	TimeToStayOpen: 10000,
	Position: "TopRight",
	HowOftenToCheck: 60000,
	ShowCloseButton: true,
	LinkText: "[[EventTitle]] is starting now, it's called <strong>[[EventTitle]]</strong>."
    });
</script>
```

# The Options #

**APIToken**

Format: String

Default: Empty

Info: You can find your API tokens - and generate new ones - under the general API section of your ScribbleLive back end. https://client.scribblelive.com/client/API.aspx

**WebsiteId**

Format: String

Default: Empty

Info: To find your website id: view the source of an event in your white label site (eg. live.yoursite.com) and search for "WebsiteID", the corresponding number is your WebsiteId.

**TimeToStayOpen**

Format: Integer

Default: 10000

Info: The amount of time in milliseconds you would like the notifier to stay open once it finds a newly started event. The default is 10000ms, or 10 seconds.

**Position**

Format: String

Default: TopRight

Options: TopLeft, TopRight, BottomLeft, and BottomRight

Info: This decides where on the screen the notifier shows up. The notifier slides in from the top if it's at the top, and from the bottom if it's at the bottom.

**HowOftenToCheck**

Format: Integer

Default: 31000

Info: How often in milliseconds you would like to hit the ScribbleLive API to check for newly opened events. The response is cached for 30000 ms by most browsers.

**ShowCloseButton**

Format: Boolean

Default: true

Info: The notifier contains a close button in the form of a little 'x' in the top right of the div. When clicked it gets rid of the notifier immediately. If you don't want to show the close button, set this to false.

**LinkText**

Format: String

Default: <strong><code>[[EventTitle]]</code></strong> is starting now. Click here to watch live.

Info: This is what shows up in the notifier. `[[EventTitle]]` is a placeholder for your event title, you can use it as many times as you like in the message. The entire string is linked to your event when displayed in the notifier.