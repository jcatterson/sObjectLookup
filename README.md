# sObjectLookup
This is a component to mimick Salesforce lookup logic.

Dependencies: jQuery


Useage:
        Create a new SObjectLookup( the_markup, string_column_array_to_query, the_sObject_table_you_want_to_query, the_field_to_filter_on );
                 define itemSelected( theSelectedItem ) and showLookup( the_lookup ) functions on SObjectLookup.

 ShowLookup - is a notification that the magnifying glass has been clicked on.
 itemSelected - after searching and selecting an item, this function is called; theSelectedItem->{"id":"The Id of the sObject clicked on", "clicked_on":"the actual column clicked on", "sobjectLookup": "the original SObjectLookup clicked on"}


Known Bugs:  Columns headers for results table might not show if the first row from the result is empty.
  See implementation of fillHeaders function.

unimplemented:
  THIS does not allow a user to simply type in the related input field to get match by name exactly.