<?php include('tooltip.php'); ?>

<div class="navbar navbar-fixed-top navbar-inverse">
    <div class="navbar-inner">
        <div class="container">

            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>

            <div class="nav-collapse collapse">
                <ul class="nav">

                    <li class="divider-vertical"></li>
                    <li>
                        <a rel="tooltip" data-placement="bottom" title="Home" href="index.php">
                            <i class="icon-home icon-large"></i>&nbsp;Home
                        </a>
                    </li>

                    <li class="divider-vertical"></li>
                    <li>
                        <a rel="tooltip" data-placement="bottom" title="About" href="about.php">
                            <i class="icon-info-sign icon-large"></i>&nbsp;About
                        </a>
                    </li>

                    <li class="divider-vertical"></li>
                    <li>
                        <a rel="tooltip" data-placement="bottom" title="Admin" href="librarian">
                            <i class="icon-user icon-large"></i>&nbsp;Admin
                        </a>
                    </li>

                    <li class="divider-vertical"></li>
                    <li>
                        <a rel="tooltip" data-placement="bottom" title="User" href="user">
                            <i class="icon-user icon-large"></i>&nbsp;User
                        </a>
                    </li>

                    <li class="divider-vertical"></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <i class="icon-book icon-large"></i>&nbsp;Sections
                            <b class="caret"></b>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="circulation_section.php"><i class="icon-search icon-large"></i> Circulation Section</a></li>
                            <li><a href="periodical_section.php"><i class="icon-search icon-large"></i> Periodical Section</a></li>
                            <li><a href="audio_visual_section.php"><i class="icon-search icon-large"></i> Audio-Visual Section</a></li>
                            <li><a href="general_reference_section.php"><i class="icon-search icon-large"></i> General Reference Section</a></li>
                            <li><a href="faculty_reading.php"><i class="icon-search icon-large"></i> Faculty Reading Section</a></li>
                            <li><a href="archive_section.php"><i class="icon-search icon-large"></i> Archive Section</a></li>
                            <li><a href="american_shelf.php"><i class="icon-search icon-large"></i> American</a></li>
                        </ul>
                    </li>

                    <li class="divider-vertical"></li>
                    <li class="signup"><span class="sg"></span></li>

                </ul>
            </div><!-- /.nav-collapse -->

        </div><!-- /.container -->
    </div><!-- /.navbar-inner -->
</div><!-- /.navbar -->
