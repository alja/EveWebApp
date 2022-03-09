

#include "collection_proxies.C"

void collection_proxies_test(bool proj=true)
{
   collection_proxies();

   eveMng->AddLocation("mydir/", "ui5");
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");
}
