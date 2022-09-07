### Defining openui5 custom sources
```

   std::string locPath = "ui5";
   eveMng->AddLocation("mydir/", locPath);
   eveMng->SetDefaultHtmlPage("file:mydir/eventDisplay.html");

```
### Run test
```
root.exe pointTest.C
```
