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

class EventManager : public REveElement
{
private:
   bool m_autoplay{false};

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
   }

   void FileDialogSaveAs(char *path)
   {
      printf("dialog path %s \n", path);
   }
};


//----------------------------------------------

REvePointSet *createPointSet(int npoints = 2, float s = 200, int color = 28)
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

void pointTest()
{
   auto eveMng = REveManager::Create();
   gEnv->SetValue("WebGui.HttpPort", 7799);
   std::string locPath = "ui5";
   eveMng->AddLocation("mydir/", locPath);
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");

   auto eventMng = new EventManager();
   eventMng->SetNameTitle("GUI_EventManager", "GUIEM");

   REveElement *event = eveMng->GetEventScene();
   auto ps = createPointSet(100);
   event->AddElement(ps);
   // Add EventManager as the last in the EveWorld
   eveMng->GetWorld()->AddElement(eventMng);
   eveMng->Show();
}
