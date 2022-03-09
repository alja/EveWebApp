/// \file
/// \ingroup tutorial_eve7
///
/// This is an example of visualization of containers
/// with REveDataCollection and REveDataProxyBuilders.
/// \macro_code
///


#include "ROOT/REveDataTable.hxx"
#include "ROOT/REveDataSimpleProxyBuilderTemplate.hxx"
#include "ROOT/REveManager.hxx"
#include "ROOT/REveScalableStraightLineSet.hxx"
#include "ROOT/REveViewContext.hxx"
#include <ROOT/REveGeoShape.hxx>
#include <ROOT/REveJetCone.hxx>
#include <ROOT/REvePointSet.hxx>
#include <ROOT/REveProjectionBases.hxx>
#include <ROOT/REveProjectionManager.hxx>
#include <ROOT/REveScene.hxx>
#include <ROOT/REveTableProxyBuilder.hxx>
#include <ROOT/REveTableInfo.hxx>
#include <ROOT/REveTrack.hxx>
#include <ROOT/REveTrackPropagator.hxx>
#include <ROOT/REveViewer.hxx>
#include <ROOT/REveViewContext.hxx>
#include <ROOT/REveBoxSet.hxx>
#include <ROOT/REveSelection.hxx>
#include <ROOT/REveCalo.hxx>

#include "TGeoTube.h"
#include "TROOT.h"
#include "TList.h"
#include "TParticle.h"
#include "TRandom.h"
#include "TApplication.h"
#include "TFile.h"
#include "TH2F.h"
#include <iostream>

#include "collection_proxies.C"

void collection_proxies_test(bool proj=true)
{
   collection_proxies();

   eveMng->AddLocation("mydir/", "ui5");
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");
}
