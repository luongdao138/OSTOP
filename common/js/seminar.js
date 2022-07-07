function dispAccompany()
{
    var count = document.seminar_entry.entry_count.value;
    if(count > 1)
    {
        document.getElementById('accompany1').style.display = 'block';
    }
    else
    {
        document.getElementById('accompany1').style.display = 'none';
    }

    if(count > 2)
    {
        document.getElementById('accompany2').style.display = 'block';
    }
    else
    {
        document.getElementById('accompany2').style.display = 'none';
    }

    if(count > 3)
    {
        document.getElementById('accompany3').style.display = 'block';
    }
    else
    {
        document.getElementById('accompany3').style.display = 'none';
    }

    if(count > 4)
    {
        document.getElementById('accompany4').style.display = 'block';
    }
    else
    {
        document.getElementById('accompany4').style.display = 'none';
    }
}

if(typeof jQuery != "undefined")
{ 
    $(document).ready(function()
    {
        dispAccompany();

        $('#entry_count').change(function()
        {
             dispAccompany();
        });
    });
}
