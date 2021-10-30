
# sub-script-test-extension

## Installing

Simply download a zip of the entire repo and use the Chrome Load Unpacked
feature to load the extension from the extracted folder.

## Comment on manifest v3

This extension uses Manifest V2, which will be sunset in a couple of years.
Using the latest manifest version (ie. 3) would have been ideal, but
unfortunately this no longer allows remote loading of Javascript code (in any
way eg. it prevents `eval()` from working).

At the very least they should maintain this capability for locally-installed
extensions. The following discussion is ongoing and I believe has a good chance
of resulting in such exceptions being added to Manifest V3.

https://issueexplorer.com/issue/w3c/webextensions/43

We will use Manifest V2 until then.

Also good reading: https://news.ycombinator.com/item?id=27441898