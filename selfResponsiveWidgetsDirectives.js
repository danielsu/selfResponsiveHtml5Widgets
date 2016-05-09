(function ( angular, _ ) {
    "use strict";

    angular.module( "selfResponsiveWidgetsDirectives", ['widgetHelpers'] )
            .directive( "widgetBreakpoints", [
                'widgetHelpers',
                '$rootScope',
                function ( widgetHelpers, $rootScope ) {
                    /*
                     Self Responsive Widgets
                     is an directive which adds or removes classes depending on the available dimensions of this widget.
                     This allows responsive design on elementary level and decouples its design from page break points.

                     Configuration:
                     Add HTML-attribute 'element-breakpoints' which contains a JSON array containing objects with minWidth and className attributes
                     e.g.
                     <my-auto-styling-widget
                     class="myTable smallView"
                     element-breakpoints="[{minWidth:'30em',className:'mediumView'},{minWidth:'60em',className:'largeView'}]"
                     ... content to be included ...
                     </my-auto-styling-widget>
                     */

                    return {
                        restrict: "A", // E-lement, A-ttribute or C-lassname
                        link: function link( scope, element, attrs ) {
//                            'attrs' contains attribute values from html tag
//                          HTML attribute contains values with singlequotes, so replace them by double quotes for JSON parse
                            var breakpointList = JSON.parse( attrs.widgetBreakpoints.replace( /'/g, '"' ) );

                            // set debounced eventlistener on window resize, debounce to reduce DOM intensive operations
                            window.addEventListener( 'resize', _.debounce( setWidgetStyle, 250 ) );
                            function setWidgetStyle() {
                                var currentWidth,
                                        currentClassName,
                                        classToAdd = "",
                                        lastPositiveClassName = "",
                                        classesToRemove = "";
                                for ( var i = 0; i < breakpointList.length; i++ ) {
                                    currentWidth = breakpointList[i].minWidth;
                                    currentClassName = breakpointList[i].className;
                                    if ( widgetHelpers.isElementWiderThanPixelOrEmValue( element.parent(), currentWidth ) ) {
                                        classToAdd = currentClassName;
                                        classesToRemove = classesToRemove + ' ' + lastPositiveClassName;
                                        lastPositiveClassName = currentClassName;
                                    } else {
                                        // remove, in case it was set
                                        classesToRemove = classesToRemove + ' ' + currentClassName;
                                    }
                                }
                                // keep only the last positive match, so remove last positive match,
                                // otherwise for the greatest breakpoint all classes would be added
                                console.log( 'widget +"' + classToAdd + '" and -"' + classesToRemove + '"' );
                                // only 2 DOM manipulations for all class updates on this widget
                                element.addClass( classToAdd )
                                        .removeClass( classesToRemove );

                                $rootScope.$broadcast( 'elementClassChanged' );
                            }

                            // call once to init
                            setWidgetStyle();
                        }
                    }
                }] );

    angular.module( 'widgetHelpers', [] )
        .factory( 'widgetHelpers', [
            function () {
                // polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
                if ( !('contains' in String.prototype) ) {
                    String.prototype.contains = function ( str, startIndex ) {
                        return -1 !== String.prototype.indexOf.call( this, str, startIndex );
                    };
                }

                /**
                 *
                 * @param _jElement
                 * @param _emValue integer only, no 'em' extension
                 */
                function compareElementWithEmValue( _jElement, _emValue ) {
                    // we have to parse the values
                    var elementWidthWithoutUnit = parseFloat( _jElement.outerWidth( true ) );
                    var fontSizeWithoutUnit = parseFloat( _jElement.css( 'fontSize' ) );
                    var pixelEquivalentValue = fontSizeWithoutUnit * _emValue;
                    return (elementWidthWithoutUnit > pixelEquivalentValue);
                }

                /**
                 * Compare width of an jQuery element to a given pixel or (responsive) em-value.
                 * @param _jElement jQuery element, needed for width and in case of em-value to get fontsize
                 * @param _comparisonPixelOrEmValue may contain 'em', 'px' or no unit
                 */
                function isElementWiderThanPixelOrEmValue( _jElement, _comparisonPixelOrEmValue ) {
                    var elementWidthWithoutUnit;
                    var valueWithoutUnit = parseFloat( _comparisonPixelOrEmValue );
                    if ( !$.isNumeric( valueWithoutUnit ) ) {
                        return null;
                    }
                    if ( _comparisonPixelOrEmValue.contains( 'em' ) ) {
                        // pass to sub fantuion to handle em-unit
                        return compareElementWithEmValue( _jElement, valueWithoutUnit );
                    } else {
                        // any other suffix was stripped of
                        elementWidthWithoutUnit = parseFloat( _jElement.outerWidth( true ) );
                        return (elementWidthWithoutUnit > valueWithoutUnit);
                    }
                }

                return{
                    isElementWiderThanPixelOrEmValue: isElementWiderThanPixelOrEmValue
                }
            }
        ] );
}( angular, _ ));