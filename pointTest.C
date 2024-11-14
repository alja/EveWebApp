/// \file
/// \ingroup tutorial_eve7
///  This example display only points in web browser
///
/// \macro_code
///

#include "TRandom.h"
#include <ROOT/REveElement.hxx>
#include <ROOT/REveScene.hxx>
#include <ROOT/REveManager.hxx>
#include <ROOT/REvePointSet.hxx>

using namespace ROOT::Experimental;

REvePointSet *createPointSet(int npoints = 100, float s = 200, int color = 28)
{
   TRandom &r = *gRandom;

   REvePointSet *ps = new REvePointSet("MyTestPoints", "list of eve points", npoints);

   for (Int_t i = 0; i < npoints; ++i)
      ps->SetNextPoint(r.Uniform(-s, s), r.Uniform(-s, s), r.Uniform(-s, s));

   ps->SetMarkerColor(color);
   ps->SetMarkerSize(3 + r.Uniform(1, 2));
   ps->SetMarkerStyle(4);

   const Double_t kR_min = 240;
   const Double_t kR_max = 250;
   const Double_t kZ_d = 300;

   auto jet = new REveJetCone();
   jet->SetCylinder(2 * kR_max, 2 * kZ_d);
   jet->AddEllipticCone(r.Uniform(-0.5, 0.5), r.Uniform(0, TMath::TwoPi()),
                        0.1, 0.2);
   jet->SetFillColor(kRed);
   jet->SetLineColor(kRed);

   ps->AddElement(jet);

   return ps;
}
// -----------------------------------------------

class EventManager : public REveElement
{
private:
   bool m_autoplay{false};

   int run{100};
   int lumi{200};
   int event{300};

public:
   void autoplay(bool x)
   {
      std::cout << "EventMaanger autoplay() ....... " << x << std::endl;
   }

   void playdelay(float x)
   {
      printf("EventManager playdelay() %f .... \n", x);
   }
  
   void goToRunEvent(int runId, int eventId, int lumiId)
   {
      printf("Got to event %d %d %d\n", runId, eventId, lumiId);
      run = runId;
      event = eventId;
      lumi = lumiId;

      StampObjProps();
   }

   void FileDialogSaveAs(char *path)
   {
      printf("dialog path %s \n", path);
   }

   void NextEvent()
   {
      auto es = gEve->GetEventScene();
      es->DestroyElements();
      es->AddElement(createPointSet());   

      event++;
      printf("EventManager::NextEvent event = %d\n", event);
      StampObjProps(); // stamp to stream changes
   }

   Int_t WriteCoreJson(nlohmann::json &j, Int_t rnr_offset) override
   {
      Int_t ret = REveElement::WriteCoreJson(j, rnr_offset);
      j["UT_PostStream"] = "UT_refresh_event_info"; // this defines GUI callback on the client
      j["run"]   = run;
      j["lumi"]  = lumi;
      j["event"] = event;

      std::cout << "json dump " << j.dump(3) << "\n";
      return ret;
   }
};


//----------------------------------------------

void pointTest()
{
   auto eveMng = REveManager::Create();

   // disable unique auth key for dec purposes 
   eveMng->AllowMultipleRemoteConnections(false, false);
   gEnv->SetValue("WebGui.HttpPort", 7799);
   std::string locPath = "ui5";
   eveMng->AddLocation("mydir/", locPath);
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");

   auto eventMng = new EventManager();
   eventMng->SetNameTitle("EventManager", "Event Manager GUI");

   REveElement *event = eveMng->GetEventScene();
   auto ps = createPointSet(100);
   event->AddElement(ps);
   // Add EventManager as the last in the EveWorld
   eveMng->GetWorld()->AddElement(eventMng);
   eveMng->Show();
}
