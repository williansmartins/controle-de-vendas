<!DOCTYPE html>
<html lang="pt-br">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1">
 <meta name="csrf-token" content="{{ csrf_token() }}">
 <title>@yield('title')</title>
 <link href="{{URL::asset('css/vendor/bootstrap.css')}}" rel="stylesheet">
 <link href="{{URL::asset('css/vendor/jquery.dataTables.min.css')}}" rel="stylesheet">
 <link href="{{URL::asset('css/style.css')}}" rel="stylesheet">
 <link href="{{URL::asset('css/novas-cores.css')}}" rel="stylesheet">
</head>
<body class="@yield('body-class')">

    <nav class="navbar navbar-inverse navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="/">
                    <img src="{{URL::asset('img/logo.png')}}" width="40px"class="hide">
                </a>
            </div>
            <div id="navbar" class="navbar-collapse collapse">
                <ul class="nav navbar-nav navbar-right">
                </ul>
            </div>
        </div>
    </nav>

    <div id="main" class="container-fluid" style="margin-top: 78px">
        @yield('content')
    </div> 

    <!-- VENDOR -->
    <script src="{{URL::asset('js/vendor/jquery/jquery.min.js')}}"></script>
    <script src="{{URL::asset('js/vendor/bootstrap/bootstrap.min.js')}}"></script>

    <!-- ESPEFICIF -->
    @yield('js-especific')

</body>
</html>