# Self Responsive HTML5 Widgets

This project aims to combine a _Content First-approach_ with _responsive design_ of a _web application_ to improve usability and readability.
Therefore is **angular directive** adds or removes classes **depending on the available dimensions of the widget itself**.
This allows responsive design on elementary level.
No more coupling of widget designs and page break points.

##Example
The example pages contains two boxes: a table on the left and a details panel on the right.
They might consume 50% width of the page each, so they adjust their size when resizing the page.

Consider the table as large table with six or more columns.
On large displays this table should be shown as it is.
On medium displays we want to minimize the width and restructure the information in two rows. 
On small displays all information of one row should be shown stacked in a single column.
This might work with media queries, based on the page width.
~~The example pages shows a vertical slider, so the user can adjust the width of the content box.~~

##Dependencies
* underscore.js for debounce()
* jQuery for container size calculations
* AngularJS 1.x

##Usage
* Import the 'selfResponsiveWidgetsDirectives.js' file.
* Add dependency for 'selfResponsiveWidgetsDirectives' in your app.
* Design your widgets with CSS base layout, e.g. using mobile first approach. Define additional class names to activate break point views (e.g. mediumView, largeView).

`app.css`

`.myTable.largeView{ ... display table with all columns visible  }`

`.myTable.mediumView{ ... display table with half the columns, but stack content to two 'rows' }`

`.myTable.smallView{ ... display table as list, collapse columns to single column }`

* In the HTML page set HTML-attribute 'element-breakpoints' which contains a JSON array containing objects with minWidth and className attributes

`<my-multi-folding-table`

`    class="myTable smallView"`

`    element-breakpoints="[{minWidth:'30em',className:'mediumView'},{minWidth:'60em',className:'largeView'}]"`

`    ... content to be included ...`

`</my-multi-folding-table>`

* Now, when resizing the page or the container, see the magic happen.

##About the project
Sometimes widgets / UI-components have got multiple layouts to provide best fit for different screen widths. Generally this is toggled via CSS Media Queries, based on the width of the page. This may get nested and complex quickly. Ideally the widget can decide based on its existing space, what layout to choose. When designing application specific widgets, it's time to define what layout is most usable on what container width.

##Alternative approaches
* **CSS Grid Systems**: Control width of components depending on the width of the page. Options to display containers as a stack. Massive layout changes not possible.
* **Media Queries in page.css**: Possible, but result in nesting of page widths and widget styles. This leads to tight coupling of page and widgets, gets complex quickly and decreases maintainability.
* **This project**: Provide design changes of widgets based on their own container width while keeping complex web applications maintainable. Uses resize-event of browser. Resize of vertical slider to be done.