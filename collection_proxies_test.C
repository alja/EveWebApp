

#include "ROOT/REveManager.hxx"
#include "collection_proxies.C"


class FWAssociation : public REveElement
{
  std::string fFilterExpr;
public:
   FWAssociation(const char* n){ SetName(n);}
   virtual ~FWAssociation() {}

   void SetFilterExpr(const char* x)
   {
      printf("setting expr to %s\n",x);
   }
};

void collection_proxies_test(bool proj=true)
{
   collection_proxies();

   auto at = ROOT::Experimental::gEve->SpawnNewScene("Associations", "Associations");
   at->AddElement(new FWAssociation("ParticleRecoClusterAssociation"));
   at->AddElement(new FWAssociation("TracksterCandidateAssociation"));
   at->AddElement(new FWAssociation("SimClusterAssociation"));

   for (auto &c : at->RefChildren())
   c->SetMainColor(kRed);


   eveMng->AddLocation("mydir/", "ui5");
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");
}
